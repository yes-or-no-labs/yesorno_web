
export const periodTimeMap:any = {
    "1h": 60 * 60,
    "1D": 60 * 60 * 24,
    "1W": 60 * 60 * 24 * 7,
    "5m": 60 * 5
};

let timezoneOffset = -new Date().getTimezoneOffset() * 60;

export async function makeApiRequest(path:string) {
    try {
        const url = new URL(`https://min-api.cryptocompare.com/${path}`);
        url.searchParams.append('api_key',"apiKey")
        const response = await fetch(url.toString());
        return response.json();
    } catch (error:any) {
        throw new Error(`CryptoCompare request error: ${error.status}`);
    }
}

// Generates a symbol ID from a pair of the coins
export function generateSymbol(exchange:string, fromSymbol:string, toSymbol:string) {
    const short = `${fromSymbol}/${toSymbol}`;
    return {
        short,
        full: `${exchange}:${short}`,
    };
}

// Returns all parts of the symbol
export function parseFullSymbol(fullSymbol:string) {
    const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
    if (!match) {
        return null;
    }

    return {
        exchange: match[1],
        fromSymbol: match[2],
        toSymbol: match[3],
    };
}

export const parseCandlesFromTicks = (ticks:any[], period:string) :any[] => {
    console.log("parseCandlesFromTicks", period, ticks)
    const periodTime = periodTimeMap[period];
    console.log("periodTime", periodTime);
    if (!ticks || ticks.length < 2) {
        return [];
    }
    ticks.sort((a, b) => a.time - b.time);

    const candles = [];
    const first = ticks[0];
    let prevTsGroup = Math.floor(first.time / periodTime) * periodTime;
    let prevPrice = Math.abs(first.amount0) / Math.abs(first.amount1);
    //console.log("prevPrice", prevPrice)
    let o = prevPrice;
    let h = prevPrice;
    let l = prevPrice;
    let c = prevPrice;
    let v = first.amount1;
    let lastCandle;
    for (let i = 1; i < ticks.length; i++) {
        const {time, amount0, amount1} = ticks[i];
        const price = Math.abs(amount0) / Math.abs(amount1);
        //console.log("time", time, price)
        const tsGroup = Math.floor(time / periodTime) * periodTime;
        if (prevTsGroup !== tsGroup) {
            lastCandle = {
                time:(prevTsGroup + timezoneOffset) as number,
                open:o,
                high:h,
                low:l,
                close:c
            }
            candles.push(lastCandle);
            o = c;
            h = Math.max(o, c);
            l = Math.min(o, c);
        }
        c = price;
        //console.log("hhh", h, price, Math.max(h, price))
        h = Math.max(h, price);
        l = Math.min(l, price);
        prevTsGroup = tsGroup;
    }
    if(lastCandle) {
        const tsGroup = Math.floor(lastCandle.time / periodTime) * periodTime;
        if(prevTsGroup !== tsGroup) {
            candles.push({
                time:prevTsGroup + timezoneOffset,
                open:o,
                high:h,
                low:l,
                close:c
            })
        } else {
            candles[candles.length - 1] = {
                open:o,
                high:h,
                low:l,
                close:c
            }
        }
    } else {
        candles.push({
            time:prevTsGroup + timezoneOffset,
            open:o,
            high:h,
            low:l,
            close:c
        })
    }
    // if(candles[0].time < Math.floor(Date.now() / 1000)){
    //     const diff = Math.floor(Date.now() / 1000) - candles[0].time
    //     console.log('diff',diff/periodTime);
    //     for (let index = 0; Math.floor(diff/periodTime); index++) {
    //         candles.unshift({
    //             time:Math.floor(Date.now() / 1000) - periodTime,
    //             open:candles[0].open,
    //             high:candles[0].high,
    //             low:candles[0].low,
    //             close:candles[0].close
    //         })

    //     }
    // }
    // for (const item of candles) {
    //     if(candles[0].time < Math.floor(Date.now() / 1000)){

    //     }

    // }

    return candles;
}
