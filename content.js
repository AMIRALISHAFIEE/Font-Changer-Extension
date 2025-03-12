let btnChange = document.querySelector(".change")
btnChange.addEventListener("click", async () => {

    let font = document.getElementById("fonts").value
    let size = document.getElementById("range").value

    chrome.storage.sync.set({ font: font, size: size });


    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: apply,
        args: [font, size],
    })
})


function apply(font, size) {
    const elements = document.querySelectorAll("*")
    const fontUrl = chrome.runtime.getURL(`fonts/${font}.woff2`)
    const style = document.createElement("style")
    style.innerText = `
    @font-face{
        font-family: '${font}'; 
        src: url('${fontUrl}'); 
    }
    `;
    document.head.appendChild(style)
    elements.forEach(element => {

        const difultSize=window.getComputedStyle(element).fontSize
        const newSize=parseFloat(difultSize)*(size/16)  
        
        element.style.fontFamily = font 
        element.style.fontSize = `${newSize}px`
    })
}
chrome.storage.sync.get(["font", "size"], ({ font, size }) => {
    if (font) document.getElementById("fonts").value = font;
    if (size) document.getElementById("range").value = size;
});