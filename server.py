import http.server
import ssl
import sys
import os

class DualStackServer(http.server.ThreadingHTTPServer):
    def server_bind(self):
        super().server_bind()

if len(sys.argv) > 1:
    os.chdir(sys.argv[1])

server_address = ('', 8085)
handler = http.server.SimpleHTTPRequestHandler

httpd = DualStackServer(server_address, handler)

context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile='/server.crt', keyfile='/server.key')

httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print("Serving HTTPS on port 8085...")
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\nShutting down server.")
    httpd.server_close()
