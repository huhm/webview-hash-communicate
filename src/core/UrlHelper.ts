/**
 * 解析locationSearch: ...(?)a=b&c=d&...
 * @param search{String|NULL}
 * @param _qsign {String} 默认值 ?
 * @param _asign {String} 默认值 &
 * @param _esign {String} 默认值 =
 * @returns {} 参数对象
 */
  export function unpackUrlSearch (search:string, _qsign?:string, _asign?:string, _esign?:string):{[key:string]:string} {
        var theRequest:any = {};
        _qsign = _qsign || "?";
        _asign = _asign || "&";
        _esign = _esign || "=";
        if (search) {
            var qIdx = search.indexOf(_qsign);
            var strEqs = search;
            if (qIdx !== -1) { // str=?后面的数据
                strEqs = search.substr(qIdx + 1);
            }
            var strEqList = strEqs.split(_asign);
            for (var i = 0, len = strEqList.length; i < len; i++) {
                decodeEq(strEqList[i]);
            }
        }

      // aaa=bbb
        function decodeEq(strEq:string) {
            var eqList = strEq.split(_esign);
            var eqVal = eqList[1];
            if (eqList[0]) {
                if (eqVal) {
                    eqVal = decodeURIComponent(eqVal);
                }
                theRequest[eqList[0]] = eqVal;
            }
        }
        return theRequest;
}

    /**
     * 组装url的参数部分
     * @param _qsign {String|NULL|} 默认值? 值为''时,返回部分不包含'?'
     * @param _asign {String} 默认值 &
     * @param _esign {String} 默认值 =
     * @returns {String|EmptyString} e.g: ?a=b&b=c
     */
 export function packUrlSearch(paramKvs:{}, _qsign?:string, _asign?:string, _esign?:string) {
     var kvList = [];
     let strVal;
    _asign = _asign || "&";
    _esign = _esign || "=";
    if (_qsign !== "") {
        _qsign = _qsign || "?";
    }
    // tslint:disable-next-line:forin
    for (var key in paramKvs) {
        strVal = paramKvs[key];
        if (strVal) {
            strVal = encodeURIComponent(strVal);
        }
        if (strVal || strVal === "" || strVal === 0) {
            kvList.push(key + _esign + strVal);
        }
    }
    if (kvList.length > 0) {
        return _qsign + kvList.join(_asign);
    } else {
        return "";
    }
}

/**
 * 组装地址
 * @param pathUrl{String} 绝对路径地址：location.origin + location.pathname
 *      e.g:http://localhost:2676/wechat/contact/home
 * @param paramKvs{Object} get参数对象可为{}
 * @param hashName{String} hash 可为空包含#(location.hash)
 *      e.g:#!home?userId=sdf
 */
export function packUrl(pathUrl: string, paramKvs: {}, hashName?: string):string {
    let newUrl = pathUrl;
    let qsign = "?";
    if (pathUrl.indexOf(qsign) > 0) {
        qsign = "";
    }
    newUrl += packUrlSearch(paramKvs,qsign);
    if (hashName) {
        newUrl += hashName;
    }
    return newUrl;
}


export function unpackUrl(url) {
    let hash = '';//#xxx
    let hashIdx = url.indexOf('#');
    if (hashIdx > 0) {
        hash = url.substr(hashIdx);
        url = url.substr(0, hashIdx);
    }
    const pathWithSearch = url;
    let path = pathWithSearch;
    let search = '';//?a=xxx
    let sIdx = path.indexOf('?');
    if (sIdx > 0) {
        search = url.substr(sIdx);
        path = url.substr(0, sIdx);
    }
    return {
        path,
        pathWithSearch,
        search,
        hash
    }
}
