// Change the webpack server port.

module.exports = {
    devServer: {
        port: 9876,
        proxy: {
            "/api": { 
                // For security purposes, This "proxy" object means that whenever we talk to the backend with "/api" in the path, it will automatically proxy to this "target" (being "localhost:8080"). The browser console will not show this path, however, this is kept hidden. This will have no effect on our MSW mock server in the testing files. See"src\Other\proxy-config-explaination.PNG" for an explanation diagram.
                target: "http://localhost:8080"
            }
        }
    }
}

