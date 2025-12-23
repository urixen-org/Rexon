#ifndef PLAYIT_CTL_H
#define PLAYIT_CTL_H

#ifdef __cplusplus
extern "C" {
#endif

#include <stdint.h>

/**
 * Opaque handle to a PlayitCtl instance.
 * Treat this as an opaque pointer - do not dereference or inspect.
 */
typedef struct PlayitCtlHandle PlayitCtlHandle;

/**
 * Result codes returned by PlayitCtl functions.
 */
typedef enum PlayitResult {
    /** Operation completed successfully */
    PLAYIT_SUCCESS = 0,
    
    /** A required pointer argument was NULL */
    PLAYIT_ERROR_NULL = 1,
    
    /** A string was not valid UTF-8 */
    PLAYIT_ERROR_INVALID_UTF8 = 2,
    
    /** IP address string could not be parsed */
    PLAYIT_ERROR_INVALID_IP = 3,
    
    /** UUID string could not be parsed */
    PLAYIT_ERROR_INVALID_UUID = 4,
    
    /** API call failed */
    PLAYIT_ERROR_API = 5,
    
    /** Operation timed out */
    PLAYIT_ERROR_TIMEOUT = 6,
    
    /** No agent could be discovered */
    PLAYIT_ERROR_NO_AGENT = 7,
    
    /** Unknown or unexpected error */
    PLAYIT_ERROR_UNKNOWN = 99
} PlayitResult;

/**
 * Create a new PlayitCtl instance.
 * 
 * @param api_base Base URL for the Playit API (e.g., "https://api.playit.gg")
 * @param secret Agent or account secret for authentication
 * @return Pointer to PlayitCtlHandle on success, NULL on error
 * 
 * @note Caller must call playit_ctl_free() when done to avoid memory leaks.
 * @note Both api_base and secret must be null-terminated UTF-8 strings.
 */
PlayitCtlHandle* playit_ctl_new(const char* api_base, const char* secret);

/**
 * Free a PlayitCtl instance and release all associated resources.
 * 
 * @param handle Handle to free (can be NULL, in which case this is a no-op)
 * 
 * @note After calling this, the handle is invalid and must not be used.
 */
void playit_ctl_free(PlayitCtlHandle* handle);

/**
 * Discover the agent ID associated with this account/secret.
 * 
 * @param handle PlayitCtl instance
 * @return Allocated string containing agent UUID, or NULL if not found or on error
 * 
 * @note Caller must free the returned string with playit_free_string()
 * @note This function blocks while making API calls
 */
char* playit_ctl_discover_agent_id(PlayitCtlHandle* handle);

/**
 * Create a tunnel using automatic fallback logic.
 * 
 * This will attempt to create a tunnel using the best available method:
 * - First tries paid-tier default origin
 * - Falls back to agent origin if needed
 * - Falls back to free-tier game-specific tunnels if needed
 * 
 * @param handle PlayitCtl instance
 * @param name Optional tunnel name (can be NULL for auto-generated name)
 * @param local_ip Local IP address to forward to (e.g., "127.0.0.1" or "0.0.0.0")
 * @param local_port Local port number to forward to
 * @param result_uuid Pointer to receive allocated UUID string on success
 * @return PLAYIT_SUCCESS on success, error code otherwise
 * 
 * @note On success, caller must free *result_uuid with playit_free_string()
 * @note This function blocks while making API calls
 * @note local_ip must be a valid IPv4 or IPv6 address string
 */
PlayitResult playit_ctl_create_tunnel_auto(
    PlayitCtlHandle* handle,
    const char* name,
    const char* local_ip,
    uint16_t local_port,
    char** result_uuid
);

/**
 * Delete a tunnel by its UUID.
 * 
 * @param handle PlayitCtl instance
 * @param tunnel_uuid UUID string of the tunnel to delete
 * @return PLAYIT_SUCCESS on success, error code otherwise
 * 
 * @note This function blocks while making API calls
 * @note tunnel_uuid must be a valid UUID string (e.g., "550e8400-e29b-41d4-a716-446655440000")
 */
PlayitResult playit_ctl_delete_tunnel(
    PlayitCtlHandle* handle,
    const char* tunnel_uuid
);

/**
 * Wait for a tunnel to be assigned a public address.
 * 
 * This polls the API until the tunnel gets an assigned address or the timeout expires.
 * 
 * @param handle PlayitCtl instance
 * @param tunnel_uuid UUID string of the tunnel to wait for
 * @param timeout_secs Maximum time to wait in seconds
 * @return Allocated string with the assigned address (e.g., "example.playit.gg:12345"), or NULL on timeout/error
 * 
 * @note Caller must free the returned string with playit_free_string()
 * @note This function blocks for up to timeout_secs seconds
 * @note Polls every 2 seconds
 */
char* playit_ctl_wait_for_assignment(
    PlayitCtlHandle* handle,
    const char* tunnel_uuid,
    uint64_t timeout_secs
);

/**
 * Free a string allocated by this library.
 * 
 * Use this to free strings returned by:
 * - playit_ctl_discover_agent_id()
 * - playit_ctl_create_tunnel_auto() (the result_uuid)
 * - playit_ctl_wait_for_assignment()
 * 
 * @param s String to free (can be NULL, in which case this is a no-op)
 */
void playit_free_string(char* s);

#ifdef __cplusplus
}
#endif

#endif /* PLAYIT_CTL_H */