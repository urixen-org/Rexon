package types

import "time"

type MsgFormat struct {
	Type    string      `json:"type"`
	Status  string      `json:"status"`
	Payload interface{} `json:"payload"`
}

type FileInfo struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Size int64  `json:"size"`
	Ext  string `json:"ext"`
	Path string `json:"path"`
}

type Tunnel struct {
	Status string `json:"status"`
	Data   struct {
		Tunnels []struct {
			ID         string    `json:"id"`
			TunnelType string    `json:"tunnel_type"`
			CreatedAt  time.Time `json:"created_at"`
			Name       string    `json:"name"`
			PortType   string    `json:"port_type"`
			PortCount  int       `json:"port_count"`
			Alloc      struct {
				Status string `json:"status"`
				Data   struct {
					ID             string `json:"id"`
					IPHostname     string `json:"ip_hostname"`
					StaticIP4      string `json:"static_ip4"`
					StaticIP6      string `json:"static_ip6"`
					AssignedDomain string `json:"assigned_domain"`
					AssignedSrv    string `json:"assigned_srv"`
					TunnelIP       string `json:"tunnel_ip"`
					PortStart      int    `json:"port_start"`
					PortEnd        int    `json:"port_end"`
					Assignment     struct {
						Type string `json:"type"`
					} `json:"assignment"`
					IPType string `json:"ip_type"`
					Region string `json:"region"`
				} `json:"data"`
			} `json:"alloc"`
			Origin struct {
				Type string `json:"type"`
				Data struct {
					AgentID   string `json:"agent_id"`
					AgentName string `json:"agent_name"`
					LocalIP   string `json:"local_ip"`
					LocalPort int    `json:"local_port"`
				} `json:"data"`
			} `json:"origin"`
			Domain     interface{} `json:"domain"`
			FirewallID interface{} `json:"firewall_id"`
			Ratelimit  struct {
				BytesPerSecond   interface{} `json:"bytes_per_second"`
				PacketsPerSecond interface{} `json:"packets_per_second"`
			} `json:"ratelimit"`
			Active              bool        `json:"active"`
			DisabledReason      interface{} `json:"disabled_reason"`
			Region              string      `json:"region"`
			ExpireNotice        interface{} `json:"expire_notice"`
			ProxyProtocol       interface{} `json:"proxy_protocol"`
			HostnameVerifyLevel string      `json:"hostname_verify_level"`
			AgentOverLimit      bool        `json:"agent_over_limit"`
		} `json:"tunnels"`
		TCPAlloc struct {
			Allowed int `json:"allowed"`
			Claimed int `json:"claimed"`
			Desired int `json:"desired"`
		} `json:"tcp_alloc"`
		UDPAlloc struct {
			Allowed int `json:"allowed"`
			Claimed int `json:"claimed"`
			Desired int `json:"desired"`
		} `json:"udp_alloc"`
	} `json:"data"`
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
type CreateTunnelRequest struct {
	Name       string       `json:"name"`
	TunnelType string       `json:"tunnel_type"`
	PortType   string       `json:"port_type"`
	PortCount  int          `json:"port_count"`
	Origin     TunnelOrigin `json:"origin"`
	Enabled    bool         `json:"enabled"`
}
type TunnelOrigin struct {
	Type string           `json:"type"`
	Data TunnelOriginData `json:"data"`
}

type TunnelOriginData struct {
	AgentID   string `json:"agent_id"`
	LocalIP   string `json:"local_ip"`
	LocalPort int    `json:"local_port"`
}

type TunnelCreationResponse struct {
	Data struct {
		ID string `json:"id"`
	} `json:"data"`
	Status string `json:"status"`
}