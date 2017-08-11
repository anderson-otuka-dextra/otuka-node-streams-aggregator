# otuka-node-streams-aggregator
Useful if needed to aggregate multiple stream outputs into a single one.
## Configuration
Check "config.json" file and change parameters accordingly:
```
{
    "stream_1_name": [
        "<ip_or_dns>", <port>,
        "<stream_path>"
    ],
    "stream_2_name": [
        "<ip_or_dns>", <port>,
        "<stream_path>"
    ]
    . . .
}
```
## Execution
Run the server with `node index.js`

After launching, point the browser or a stream consumer to `http://localhost:3000`


# hystrix-dashboard-patch
Contains a patch for [Hystrix Dashboard](https://github.com/Netflix/Hystrix/wiki/Dashboard) to use an aggregated stream instead of multiple streams.
## Configuration
After cloning [Hystrix Dashboard GIT repository](https://github.com/Netflix/Hystrix/tree/master/hystrix-dashboard), override `hystrix-dashboard/src/main/webapp/monitor/monitor.html` with `monitor.html`.
## Execution
Once patched, [launch the Hystrix Dashboard as usual](https://github.com/Netflix/Hystrix/wiki/Dashboard#run-via-gradle).

One should add `http://localhost:3000` as the single stream URL.