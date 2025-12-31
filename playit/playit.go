package playit

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

const DefaultAPIBase = "https://api.playit.gg"

// Client represents the PlayIt Agent API client
type Client struct {
	AgentKey   string
	HTTPClient *http.Client
}

type AgentRunData struct {
	Status string `json:"status"`
	Data   struct {
		AgentID       string `json:"agent_id"`
		AgentType     string `json:"agent_type"`
		AccountStatus string `json:"account_status"`
		Tunnels       []struct {
			ID         string `json:"id"`
			InternalID int    `json:"internal_id"`
			Name       string `json:"name"`
			IPNum      int    `json:"ip_num"`
			RegionNum  int    `json:"region_num"`
			Port       struct {
				From int `json:"from"`
				To   int `json:"to"`
			} `json:"port"`
			Proto          string      `json:"proto"`
			LocalIP        string      `json:"local_ip"`
			LocalPort      int         `json:"local_port"`
			TunnelType     string      `json:"tunnel_type"`
			AssignedDomain string      `json:"assigned_domain"`
			CustomDomain   interface{} `json:"custom_domain"`
			Disabled       interface{} `json:"disabled"`
			ProxyProtocol  interface{} `json:"proxy_protocol"`
			AgentConfig    struct {
				Fields []struct {
					Name  string `json:"name"`
					Value string `json:"value"`
				} `json:"fields"`
			} `json:"agent_config"`
		} `json:"tunnels"`
		Pending         []interface{} `json:"pending"`
		AccountFeatures struct {
			RegionalTunnels bool `json:"regional_tunnels"`
		} `json:"account_features"`
	} `json:"data"`
}

// NewClient creates a new PlayIt Agent API client with an agent key
func NewClient(agentKey string) *Client {
	return &Client{
		AgentKey:   agentKey,
		HTTPClient: &http.Client{},
	}
}

// NewUnauthenticatedClient creates a client without authentication for public endpoints
func NewUnauthenticatedClient() *Client {
	return &Client{
		HTTPClient: &http.Client{},
	}
}

// doRequest performs an HTTP request with common headers
func (c *Client) doRequest(method, path string, body interface{}, needsAuth bool) ([]byte, error) {
	var reqBody io.Reader
	if body != nil {
		jsonData, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal request body: %w", err)
		}
		reqBody = bytes.NewBuffer(jsonData)
	}

	req, err := http.NewRequest(method, DefaultAPIBase+path, reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	if needsAuth && c.AgentKey != "" {
		req.Header.Set("Authorization", "Agent-Key "+c.AgentKey)
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return respBody, fmt.Errorf("API error (status %d): %s", resp.StatusCode, string(respBody))
	}

	return respBody, nil
}

// TunnelOrigin represents the origin configuration for a tunnel
type TunnelOrigin struct {
	Type string           `json:"type"`
	Data TunnelOriginData `json:"data"`
}

// TunnelOriginData contains agent-specific tunnel origin data
type TunnelOriginData struct {
	AgentID   string `json:"agent_id"`
	LocalIP   string `json:"local_ip"`
	LocalPort int    `json:"local_port"`
}

// CreateTunnelRequest represents the request to create a new tunnel
type CreateTunnelRequest struct {
	Name       string       `json:"name"`
	TunnelType string       `json:"tunnel_type"`
	PortType   string       `json:"port_type"`
	PortCount  int          `json:"port_count"`
	Origin     TunnelOrigin `json:"origin"`
	Enabled    bool         `json:"enabled"`
}

// CreateTunnel creates a new tunnel with the specified configuration
// Parameters:
//   - name: Human-readable name for the tunnel
//   - tunnelType: Type of tunnel (e.g., "minecraft-java", "minecraft-bedrock")
//   - portType: Protocol type ("tcp" or "udp")
//   - portCount: Number of ports to allocate
//   - agentID: ID of the agent that will handle this tunnel
//   - localIP: Local IP address to forward traffic to
//   - localPort: Local port to forward traffic to
//   - enabled: Whether the tunnel should be active
func (c *Client) CreateTunnel(name, tunnelType, portType string, portCount int, agentID, localIP string, localPort int, enabled bool) ([]byte, error) {
	req := CreateTunnelRequest{
		Name:       name,
		TunnelType: tunnelType,
		PortType:   portType,
		PortCount:  portCount,
		Origin: TunnelOrigin{
			Type: "agent",
			Data: TunnelOriginData{
				AgentID:   agentID,
				LocalIP:   localIP,
				LocalPort: localPort,
			},
		},
		Enabled: enabled,
	}

	return c.doRequest("POST", "/tunnels/create", req, true)
}

// DeleteTunnelRequest represents the request to delete a tunnel
type DeleteTunnelRequest struct {
	TunnelID string `json:"tunnel_id"`
}

// DeleteTunnel deletes an existing tunnel by its ID
// Parameters:
//   - tunnelID: UUID of the tunnel to delete
func (c *Client) DeleteTunnel(tunnelID string) ([]byte, error) {
	req := DeleteTunnelRequest{
		TunnelID: tunnelID,
	}

	return c.doRequest("POST", "/tunnels/delete", req, true)
}

// ClaimDetailsRequest represents the request to get claim details
type ClaimDetailsRequest struct {
	Code string `json:"code"`
}

// GetClaimDetails retrieves details about a claim code without authentication
// This is a public endpoint used during the agent claiming process
// Parameters:
//   - code: The claim code to look up
func (c *Client) GetClaimDetails(code string) ([]byte, error) {
	req := ClaimDetailsRequest{
		Code: code,
	}

	return c.doRequest("POST", "/claim/details", req, false)
}

// ClaimSetupRequest represents the request to setup a claim
type ClaimSetupRequest struct {
	Code      string `json:"code"`
	AgentType string `json:"agent_type"`
	Version   string `json:"version"`
}

// SetupClaim sets up a new agent claim without authentication
// This is used to initialize the claim process before authentication
// Parameters:
//   - code: The claim code
//   - agentType: Type of agent (e.g., "self-managed")
//   - version: Agent version string
func (c *Client) SetupClaim(code, agentType, version string) ([]byte, error) {
	req := ClaimSetupRequest{
		Code:      code,
		AgentType: agentType,
		Version:   version,
	}

	return c.doRequest("POST", "/claim/setup", req, false)
}

// ClaimExchangeRequest represents the request to exchange a claim code
type ClaimExchangeRequest struct {
	Code string `json:"code"`
}

// ExchangeClaim exchanges a claim code for agent credentials without authentication
// This is the final step in the claim process that returns the agent key
// Parameters:
//   - code: The claim code to exchange
//
// Returns: Response containing the agent key and credentials
func (c *Client) ExchangeClaim(code string) ([]byte, error) {
	req := ClaimExchangeRequest{
		Code: code,
	}

	return c.doRequest("POST", "/claim/exchange", req, false)
}

// ClaimAcceptRequest represents the request to accept a claim
type ClaimAcceptRequest struct {
	Code      string `json:"code"`
	Name      string `json:"name"`
	AgentType string `json:"agent_type"`
}

// AcceptClaim accepts a claim and assigns it to an agent without authentication
// Used when confirming a claim before exchange
// Parameters:
//   - code: The claim code
//   - name: Name for the agent
//   - agentType: Type of agent (e.g., "self-managed")
func (c *Client) AcceptClaim(code, name, agentType string) ([]byte, error) {
	req := ClaimAcceptRequest{
		Code:      code,
		Name:      name,
		AgentType: agentType,
	}

	return c.doRequest("POST", "/claim/accept", req, false)
}

// ClaimRejectRequest represents the request to reject a claim
type ClaimRejectRequest struct {
	Code string `json:"code"`
}

// RejectClaim rejects a claim code without authentication
// Used to decline a claim during the claiming process
// Parameters:
//   - code: The claim code to reject
func (c *Client) RejectClaim(code string) ([]byte, error) {
	req := ClaimRejectRequest{
		Code: code,
	}

	return c.doRequest("POST", "/claim/reject", req, false)
}

// AgentVersion contains version information for an agent
type AgentVersion struct {
	Version        VersionInfo `json:"version"`
	Official       bool        `json:"official"`
	DetailsWebsite string      `json:"details_website"`
	ProtoVersion   int         `json:"proto_version"`
}

// VersionInfo contains platform and version details
type VersionInfo struct {
	Platform   string `json:"platform"`
	Version    string `json:"version"`
	HasExpired bool   `json:"has_expired"`
}

// ProtoRegisterRequest represents the request to register protocol information
type ProtoRegisterRequest struct {
	AgentVersion AgentVersion `json:"agent_version"`
	ClientAddr   string       `json:"client_addr"`
	TunnelAddr   string       `json:"tunnel_addr"`
}

// RegisterProto registers the agent with protocol and version information
// Parameters:
//   - platform: Platform name (e.g., "linux", "windows")
//   - version: Version string
//   - hasExpired: Whether this version has expired
//   - official: Whether this is an official build
//   - protoVersion: Protocol version number
//   - clientAddr: Client address (IP:port)
//   - tunnelAddr: Tunnel address (IP:port)
func (c *Client) RegisterProto(platform, version string, hasExpired, official bool, protoVersion int, clientAddr, tunnelAddr string) ([]byte, error) {
	req := ProtoRegisterRequest{
		AgentVersion: AgentVersion{
			Version: VersionInfo{
				Platform:   platform,
				Version:    version,
				HasExpired: hasExpired,
			},
			Official:       official,
			DetailsWebsite: "null",
			ProtoVersion:   protoVersion,
		},
		ClientAddr: clientAddr,
		TunnelAddr: tunnelAddr,
	}

	return c.doRequest("POST", "/proto/register", req, true)
}

// LoginGuest creates a guest login session without authentication
// This is a public endpoint that returns credentials for a temporary guest account
// Returns: Response containing guest account credentials
func (c *Client) LoginGuest() ([]byte, error) {
	return c.doRequest("POST", "/login/guest", map[string]interface{}{}, false)
}

// AgentRoutingRequest represents the request to get agent routing information
type AgentRoutingRequest struct {
	AgentID *string `json:"agent_id"`
}

// GetAgentRouting retrieves routing information for an agent
// Parameters:
//   - agentID: Optional agent ID (nil for current agent)
func (c *Client) GetAgentRouting(agentID *string) ([]byte, error) {
	req := AgentRoutingRequest{
		AgentID: agentID,
	}

	return c.doRequest("POST", "/agents/routing/get", req, true)
}

// GetAgentRunData retrieves runtime data for the current agent
// Returns information about the agent's current execution state
func (c *Client) GetAgentRunData() ([]byte, error) {
	return c.doRequest("POST", "/agents/rundata", map[string]interface{}{}, true)
}

// PingSample represents a single ping measurement sample
type PingSample struct {
	TunnelServerID int `json:"tunnel_server_id"`
	DCID           int `json:"dc_id"`
	ServerTS       int `json:"server_ts"`
	Latency        int `json:"latency"`
	Count          int `json:"count"`
	Num            int `json:"num"`
}

// PingTarget represents a ping target with IP and port
type PingTarget struct {
	IP   string `json:"ip"`
	Port int    `json:"port"`
}

// PingResult represents ping results for a specific target
type PingResult struct {
	ID      int          `json:"id"`
	Target  PingTarget   `json:"target"`
	Samples []PingSample `json:"samples"`
}

// SubmitPingRequest represents the request to submit ping results
type SubmitPingRequest struct {
	Results []PingResult `json:"results"`
}

// SubmitPing submits ping measurement results to the API
// Parameters:
//   - results: Array of ping results containing latency measurements
func (c *Client) SubmitPing(results []PingResult) ([]byte, error) {
	req := SubmitPingRequest{
		Results: results,
	}

	return c.doRequest("POST", "/ping/submit", req, true)
}

// GetPing retrieves ping configuration and targets for the agent
// Returns information about which servers to ping and how often
func (c *Client) GetPing() ([]byte, error) {
	return c.doRequest("POST", "/ping/get", map[string]interface{}{}, true)
}

// ListTunnelsRequest represents the request to list tunnels
type ListTunnelsRequest struct {
	TunnelID any `json:"tunnel_id"`
	AgentID  any `json:"agent_id"`
}

// ListTunnels retrieves a list of tunnels
// Parameters:
//   - tunnelID: Optional tunnel ID to filter by (nil for all)
//   - agentID: Optional agent ID to filter by (nil for all)
func (c *Client) ListTunnels(tunnelID, agentID any) ([]byte, error) {
	req := ListTunnelsRequest{
		TunnelID: tunnelID,
		AgentID:  agentID,
	}

	return c.doRequest("POST", "/tunnels/list", req, true)
}

// ListAgents retrieves a list of all agents associated with the account
func (c *Client) ListAgents() ([]byte, error) {
	return c.doRequest("POST", "/agents/list", map[string]interface{}{}, true)
}

// QueryRegionRequest represents the request to query region information
type QueryRegionRequest struct {
	LimitRegion *string `json:"limit_region"`
}

// QueryRegion queries available regions for tunnel deployment
// Parameters:
//   - limitRegion: Optional region code to limit results (nil for all)
func (c *Client) QueryRegion(limitRegion *string) ([]byte, error) {
	req := QueryRegionRequest{
		LimitRegion: limitRegion,
	}

	return c.doRequest("POST", "/query/region", req, true)
}

// UpdateTunnelRequest represents the request to update a tunnel
type UpdateTunnelRequest struct {
	TunnelID  string `json:"tunnel_id"`
	LocalIP   string `json:"local_ip"`
	LocalPort int    `json:"local_port"`
	AgentID   string `json:"agent_id"`
	Enabled   bool   `json:"enabled"`
}

// UpdateTunnel updates an existing tunnel's configuration
// Parameters:
//   - tunnelID: UUID of the tunnel to update
//   - localIP: New local IP address
//   - localPort: New local port
//   - agentID: Optional new agent ID (nil to keep current)
//   - enabled: Whether the tunnel should be enabled
func (c *Client) UpdateTunnel(tunnelID, localIP string, localPort int, agentID string, enabled bool) ([]byte, error) {
	req := UpdateTunnelRequest{
		TunnelID:  tunnelID,
		LocalIP:   localIP,
		LocalPort: localPort,
		AgentID:   agentID,
		Enabled:   enabled,
	}

	return c.doRequest("POST", "/tunnels/update", req, true)
}

// AssignFirewallRequest represents the request to assign a firewall to a tunnel
type AssignFirewallRequest struct {
	TunnelID   string  `json:"tunnel_id"`
	FirewallID *string `json:"firewall_id"`
}

// AssignFirewall assigns a firewall rule set to a tunnel
// Parameters:
//   - tunnelID: UUID of the tunnel
//   - firewallID: Optional firewall ID (nil to remove firewall)
func (c *Client) AssignFirewall(tunnelID string, firewallID *string) ([]byte, error) {
	req := AssignFirewallRequest{
		TunnelID:   tunnelID,
		FirewallID: firewallID,
	}

	return c.doRequest("POST", "/tunnels/firewall/assign", req, true)
}

// SetProxyProtocolRequest represents the request to set proxy protocol
type SetProxyProtocolRequest struct {
	TunnelID      string  `json:"tunnel_id"`
	ProxyProtocol *string `json:"proxy_protocol"`
}

// SetProxyProtocol configures proxy protocol settings for a tunnel
// Parameters:
//   - tunnelID: UUID of the tunnel
//   - proxyProtocol: Optional proxy protocol version (nil to disable)
func (c *Client) SetProxyProtocol(tunnelID string, proxyProtocol *string) ([]byte, error) {
	req := SetProxyProtocolRequest{
		TunnelID:      tunnelID,
		ProxyProtocol: proxyProtocol,
	}

	return c.doRequest("POST", "/tunnels/proxy/set", req, true)
}

// UnifiedResponse represents a standard API response structure
type UnifiedResponse struct {
	Data struct {
		SecretKey string `json:"secret_key"`
	} `json:"data"`
	Error string `json:"error,omitempty"`
}

// ClaimExchangeData represents the successful exchange response data
type ClaimExchangeData struct {
	AgentKey string `json:"agent_key"`
}

type ClaimSetupResponse struct {
	Status string `json:"status"`
	Data   string `json:"data"`
}

type CreateJavaTunnelType struct {
	TunnelType string `json:"tunnel_type"`
	AgentID    string `json:"agent_id"`
	LocalIP    string `json:"local_ip"`
	LocalPort  int    `json:"local_port"`
	PortType   string `json:"port_type"`
	PortCount  int    `json:"port_count"`
	Type       string `json:"type"`
}

func (c *Client) CreateJavaTunnel(agentID string, localIP string, localPort int, portType string, portCount int) ([]byte, error) {
	req := CreateJavaTunnelType{
		TunnelType: "minecraft-java",
		AgentID:    agentID,
		LocalIP:    localIP,
		LocalPort:  localPort,
		PortType:   portType,
		PortCount:  portCount,
		Type:       "create-tunnel",
	}

	return c.doRequestCloud("POST", "/account", req, true)
}

func (c *Client) doRequestCloud(method, path string, body interface{}, needsAuth bool) ([]byte, error) {
	var reqBody io.Reader
	if body != nil {
		jsonData, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal request body: %w", err)
		}
		reqBody = bytes.NewBuffer(jsonData)
	}

	req, err := http.NewRequest(method, "https://api.playit.cloud"+path, reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	if needsAuth && c.AgentKey != "" {
		req.Header.Set("Authorization", "agent-key "+c.AgentKey)
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return respBody, fmt.Errorf("API error (status %d): %s", resp.StatusCode, string(respBody))
	}

	return respBody, nil
}
