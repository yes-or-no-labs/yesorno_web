import {io} from "socket.io-client";

const _serverAPI = "https://api.corex.network";

let _socket:any = null;
let _newBarCallback:any = null;
let _historyTradeCallback:any = null;
let _newTradeCallback:any = null;

export const streamInit = () => {

    if(_socket != null) {
        console.log("connected")
        return;
    }

    _socket = io(_serverAPI, {
        path:'/candle-ws',
        transports: ['websocket'], // 指定传输方式，如WebSocket
        autoConnect: true, // 是否自动连接
        reconnection: true, // 是否自动重新连接
        reconnectionAttempts: 3, // 重新连接尝试次数
        reconnectionDelay: 1000, // 重新连接延迟时间（毫秒）
    });

    _socket.on("connect", () => {
        console.log("connect", _socket.id); //ojIckSD2jqNzOqIrAGzL
    });

    _socket.on("disconnect", (reason:any) => {
        console.log("disconnect", reason);
        _socket = null;
    });

    _socket.on("TICK", (data:any) => {
        console.log("TICK", data);
        if(_newBarCallback) {
            _newBarCallback({
                time:data.time,
                open:0,
                high:0,
                low:0,
                close:0,
                volume:1
            });
        }
        if(_newTradeCallback) {
            _newTradeCallback(data);
        }
    })

    _socket.on("SUB", (data:any) => {
        console.log("SUB", data);
    })

    _socket.on("UN_SUB", (data:any) => {
        console.log("UN_SUB", data);
    })

    _socket.on("LATEST", (data:any) => {
        console.log("LATEST", data);
        if(_historyTradeCallback) {
            _historyTradeCallback(data);
        }
    })
}


//订阅数据
export const streamSubscribe = (poolCode:string, onNewBarCallback:any) => {
    console.log("SUB", poolCode)
    _socket.emit("SUB", poolCode);
    _newBarCallback = onNewBarCallback;
}

//退订数据
export const streamUnsubscribe = () => {
    _socket.emit("UN_SUB", {});
    _newBarCallback = null;
}

//设置交易记录回调
export const streamSetTradeCallback = (historyCallback:any, newCallback:any) => {
    _newBarCallback = newCallback;
    _historyTradeCallback = historyCallback;
}



