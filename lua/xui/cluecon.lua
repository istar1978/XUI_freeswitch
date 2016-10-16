method = env:getHeader("Request-Method")
http_uri = env:getHeader("HTTP-Request-URI")
a = env:getHeader("a")
b = env:getHeader("b")
sum = ""

if (a and b) then
	sum = "sum = " .. (a + b)
end

ret = "method: " .. method .. "\n" ..
	"http_uri: " .. http_uri .. "\n" ..
	"Hello ClueCon " .. sum .. "\n"

stream:write("HTTP/1.0 200 OK\r\n")
stream:write("Content-Type: text/plain\r\n")
stream:write("\r\n")
stream:write(ret)
