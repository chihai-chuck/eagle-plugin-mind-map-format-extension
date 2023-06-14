const fs = require("fs");

const urlParams = new URLSearchParams(window.location.search);
const filePath = urlParams.get("path");
const theme = urlParams.get("theme");

window.onload = async () => {
    try {
        if(filePath.endsWith(".km")) {
            document.querySelector("#minder-view").innerHTML = await fs.promises.readFile(filePath, "utf-8");
            const km = new kityminder.Minder();
            km.setup("#minder-view");
            // km.disable();
            await new Promise(resolve => {
                const init = () => {
                    // kityminder文档中说的.once监听并不存在，所以如果只监听一次，需要自行调用off销毁监听
                    km.off("layoutallfinish", init);
                    km.execCommand("camera", km.getRoot());
                    km.execCommand("hand");
                    if(theme === "light" || theme === "lightgray") {
                        setTimeout(resolve, 300);
                    } else {
                        km.execCommand("theme", "classic");
                        const themeInit = () => {
                            // kityminder并不支持初始化的时候选择主题，只能在初始化之后才能更换主题，更换主题会有一次重载的过程，所以需要再监听一次主题变更的初始化才是真正的初始化完成
                            km.off("layoutallfinish", themeInit);
                            resolve();
                        }
                        km.on("layoutallfinish", themeInit);
                    }
                }
                km.on("layoutallfinish", init);
            });
            document.querySelector("#minder-view").style.opacity = "1";
        }
    } catch (err) {
        console.error(err);
        const message = err.message || err || "未知错误";
        alert(`思维导图格式扩展插件错误: ${message}`);
        /*eagle.log.error(`思维导图格式扩展插件错误: ${message}`);
        eagle.notification.show({
            title: "错误",
            description: message,
        });*/
    }
}
