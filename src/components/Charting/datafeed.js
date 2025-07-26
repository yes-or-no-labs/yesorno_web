


const configurationData = {
    supports_search: true,
    supports_group_request: false,
    supports_marks: true,
    supports_timescale_marks: true,
    supports_time: true,
    // Represents the resolutions for bars supported by your datafeed
    supported_resolutions: ['1','5','30','1h','1D', '1W', '1M'],
    // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
    exchanges: [{value: 'COREx', name: 'COREx', desc: 'COREx Network'}],
    // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
    symbols_types: [{name: 'crypto', value: 'crypto'}],
};

const Resolutions = {
    '1': '1m',
    '5': '5m',
    '30': '30m',
    '60': '1h',
    'D': '1d',
    'W': '1w',
    '1D': '1d',
    '1W': '1w',
}


async function getAllSymbols() {
    let allSymbols = [/*{
        symbol: 'BTC/USD',
        full_name: 'BTC',
        description: 'BTC/USD',
        exchange: 'COREx',
        type: 'crypto',
    }*/];
    return allSymbols;
}


export class Datafeed {
    constructor(data) {
        this.vueInstenceData = data; // 传入 Vue 组件的方法
        this.subscribers = new Map(); // 存储订阅的回调
    }
    onReady(callback) {
        console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData));
    }

    // async searchSymbols(userInput: string, exchange: string, symbolType: string, onResultReadyCallback: any) {
    //     console.log('[searchSymbols]: Method call');
    //     const symbols = await getAllSymbols();
    //     const newSymbols = symbols.filter((symbol: any) => {
    //         const isExchangeValid = exchange === '' || symbol.exchange === exchange;
    //         const isFullSymbolContainsInput = symbol.full_name
    //             .toLowerCase()
    //             .indexOf(userInput.toLowerCase()) !== -1;
    //         return isExchangeValid && isFullSymbolContainsInput;
    //     });
    //     onResultReadyCallback(newSymbols);
    // }


    async resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
        console.log('[resolveSymbol]: Method call', symbolName);
        // const symbols: any = await getAllSymbols();

        // const symbolItem = symbols.find((target: any) => target.full_name === symbolName);
        // if (!symbolItem) {
        //     console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
        //     onResolveErrorCallback('cannot resolve symbol');
        //     return;
        // }
        // Symbol information object
        const symbolInfo = {
            ticker: symbolName,
            name: symbolName,
            description: symbolName,
            type: 'crypto',
            session: '24x7',
            timezone: 'Asia/Shanghai',
            exchange: '',
            minmov: 1,
            pricescale: 100,
            has_intraday: true,
            has_no_volume: true,
            has_empty_bars: true,
            has_weekly_and_monthly: true,
            supported_resolutions: ['1','5','30','1h','1D', '1W', '1M'],
            volume_precision: 2,
            data_status: 'streaming',
        };

        console.log('[resolveSymbol]: Symbol resolved', symbolName);
        onSymbolResolvedCallback(symbolInfo);
    }


    async getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {
        //async getBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, rangeStartDate: number, rangeEndDate: number, onHistoryCallback: HistoryCallback, onErrorCallback: ErrorCallback, firstDataRequest: boolean) {

        const {from, to, firstDataRequest} = periodParams;
        // console.log('[getBars]: Method call', formatDateTime(from, 1),  formatDateTime(to, 1), firstDataRequest, onHistoryCallback, onErrorCallback);
        // console.log('getBars', resolution, 'from', from, 'to', to);

        //console.log('[getBars]: Method call', resolution, formatDateTime(rangeStartDate, 1), rangeStartDate, formatDateTime(rangeEndDate, 1), rangeEndDate, firstDataRequest, onHistoryCallback, onErrorCallback);
        /*const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
        const urlParameters = {
            e: parsedSymbol.exchange,
            fsym: parsedSymbol.fromSymbol,
            tsym: parsedSymbol.toSymbol,
            toTs: to,
            limit: 2000,
        };
        const query = Object.keys(urlParameters)
            .map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
            .join('&');*/
        const response = await fetch(`https://api1.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${Resolutions[resolution]}&startTime=${from*1000}&endTime=${to*1000}`);

        //streamFetchHistory("0x3C70DDCd072A684e82B52CC776E3C96722f05b35");
        // const result = await apiCandleHistory("0xd203eAB4E8c741473f7456A9f32Ce310d521fa41", from, 1000);
        // const candles = parseCandlesFromTicks(result.data, Resolutions[resolution]);
        const res = await response.json();
        // console.log("candles", res);

        if(res.length == 0){
            onHistoryCallback([], {
                noData: true,
            });
            return;
        }
        const kline = res.map(kline => ({
            time: kline[0],      // 转换为秒
            open: parseFloat(kline[1]),
            high: parseFloat(kline[2]),
            low: parseFloat(kline[3]),
            close: parseFloat(kline[4]),
            volume: parseFloat(kline[5]),
        }));
        console.log('kline', kline);
        onHistoryCallback(kline, {
            noData: false,
        });
        
        // try {
        //     if (candles.length == 0) {
        //         // "noData" should be set if there is no data in the requested period
        //         onHistoryCallback([], {
        //             noData: true,
        //         });
        //         return;
        //     }
        //     let bars = [];
        //     // console.log('qwdqwdwdq',bars[0]?.time,candles[0].time*1000);

        //     // if(bars.length>0&&bars[0].time == candles[0].time*1000){
        //     //     onHistoryCallback([], {
        //     //         noData: true,
        //     //     });
        //     // }
        //     candles.forEach(bar => {
        //         if (bar.time >= from && bar.time < to) {
        //             bars = [...bars, {
        //                 time: bar.time * 1000,
        //                 low: bar.low,
        //                 high: bar.high,
        //                 open: bar.open,
        //                 close: bar.close,
        //                 volume: 100
        //             }];
        //         }
        //         // bars = [...bars, {
        //         //             time: bar.time * 1000,
        //         //             low: bar.low,
        //         //             high: bar.high,
        //         //             open: bar.open,
        //         //             close: bar.close,
        //         //             volume: 100
        //         //         }];
        //     });
        //     console.log('bars', bars);

        //     if (firstDataRequest) {
        //         /*lastBarsCache.set(symbolInfo.full_name, {
        //             ...bars[bars.length - 1],
        //         });*/
        //     }
        //     // console.log(`[getBars]: ${JSON.stringify(bars)}`);
        //     if (bars.length == 0) {
        //         onHistoryCallback(bars, {
        //             noData: true,
        //         });
        //     } else {
        //         onHistoryCallback(bars, {
        //             noData: false,
        //         });
        //     }

        // } catch (error) {
        //     console.log('[getBars]: Get error', error);
        //     onErrorCallback(error);
        // }
    }


    subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
        console.log('subscribeBars', resolution);
        this.vueInstenceData.getRealtimeData(resolution,onRealtimeCallback)
        /*subscribeOnStream(
            symbolInfo,
            resolution,
            onRealtimeCallback,
            subscriberUID,
            onResetCacheNeededCallback,
            lastBarsCache.get(symbolInfo.full_name),
        );*/
    }

    unsubscribeBars(subscriberUID) {
        console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
        /*unsubscribeFromStream(subscriberUID);*/
    }
}
