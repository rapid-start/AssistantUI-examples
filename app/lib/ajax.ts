export function ajax(url: string, options: {
    method?: string,
    headers?: {
        [key: string]: any
    },
    params?: {
        [key: string]: any
    }
}): Promise<any> {

    return new Promise(function (resolve, reject) {

        fetch("http://localhost:3001/llm" + url, {
            method: options.method || "POST",
            headers: options.headers || {},
            body: JSON.stringify(options.params)
        }).then(function (res1) {

            if (res1.status === 200) {
                return res1.json().then(res2 => {
                    resolve(res2);
                });
            } else {
                res1.text().then(res2 => {
                    reject(res2);
                });
            }

        });

    });

}