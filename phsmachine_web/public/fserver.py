import http.server
import socketserver

PORT = 8001

handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), handler) as httpd:
    print("FServer started at localhost:" + str(PORT))
    httpd.serve_forever()