document.getElementById("pdf-upload").addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;

    const chatContainer = document.getElementById("chat-container");
    chatContainer.innerHTML = ""; 

    const punctuationEnders = ['.', '!', '?']; 
    const maxWordsPerParagraph = 10; 
    let messageCount = 0; 

    const emojis = ["❤️", "😊", "🔥", "😎", "💥", "✨", "🎉", "🎶", "🌟", "💯", "", ""];
    const exclamations = ["!!!", "!?", "!!", "!", "<3", "xo", "lol", "ok", "bbg", ";)", "", ""]


    const boldFontSizeThreshold = 10;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        let paragraph = "";
        let wordCount = 0;

        textContent.items.forEach((item, index) => {
            const text = item.str.trim();
            const fontSize = item.transform[3]; 
            const fontWeight = item.fontName ? item.fontName.includes('Bold') : false; 

            
            if (text) {

                const isBold = fontSize > boldFontSizeThreshold || fontWeight;

                //if bold then its a heading
                

                const isEndOfSentence = punctuationEnders.some(punct => text.endsWith(punct));
                const isMaxWordCountReached = wordCount >= maxWordsPerParagraph;

                if (isBold) {
                    if (paragraph) {
                        paragraph = paragraph.toLowerCase();

                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        const randomExclamation = exclamations[Math.floor(Math.random() * exclamations.length)];

                        const message = document.createElement("div");
                        message.classList.add("message");
                        if(paragraph.length > 300) {
                            message.innerHTML = `
                            <div class="message-content">yap alert ahead >///< : ${paragraph}${randomEmoji}</div>
                        `;
                        }
                        else if (messageCount % 4 === 0) {
                            message.innerHTML = `
                                <div class="message-username">
                                     <img src="meow.png" class="profile-pic" alt="Profile Picture">
                                    <span class="username">discordaddiction</span>
                                </div>
                                <div class="message-content">${paragraph}</div>
                            `;
                        } else {
                            message.innerHTML = `
                                <div class="message-content">${paragraph}${randomEmoji} ${randomExclamation}</div>
                            `;
                        }
                        
                        chatContainer.appendChild(message);
                        paragraph = ""; 
                        wordCount = 0; 
                        messageCount++;
                    }
                    const headingMessage = document.createElement("div");
                    headingMessage.classList.add("message");
                    headingMessage.innerHTML = `
                        <div style="display: flex; align-items: center;">
                            <img class="profile-pic" src="meow.png" alt="Profile">
                            <span class="message-username">discordaddiction</span>
                        </div>
                        <div class="message-content" style="font-weight: bold; font-size: 1.2rem;">
                            ${text}
                        </div>
                    `;
                    chatContainer.appendChild(headingMessage);

                    return;

                }



                paragraph += (paragraph ? " " : "") + text;
                wordCount++;

                if (isEndOfSentence || isMaxWordCountReached || index === textContent.items.length - 1) {
                    if (paragraph) {
                        paragraph = paragraph.toLowerCase();

                        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        const randomExclamation = exclamations[Math.floor(Math.random() * exclamations.length)];

                        const message = document.createElement("div");
                        message.classList.add("message");
                        if(paragraph.length > 300) {
                            message.innerHTML = `
                            <div class="message-content">yap alert ahead >///< : ${paragraph}${randomEmoji}</div>
                        `;
                        }
                        else if (messageCount % 4 === 0) {
                            message.innerHTML = `
                                <div class="message-username">
                                     <img src="meow.png" class="profile-pic" alt="Profile Picture">
                                    <span class="username">discordaddiction</span>
                                </div>
                                <div class="message-content">${paragraph}</div>
                            `;
                        } else {
                            message.innerHTML = `
                                <div class="message-content">${paragraph}${randomEmoji} ${randomExclamation}</div>
                            `;
                        }
                        
                        chatContainer.appendChild(message);
                        paragraph = ""; 
                        wordCount = 0; 
                        messageCount++;
                    }
                }
            }
        });

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ canvasContext: context, viewport }).promise;

        const img = document.createElement("img");
        img.src = canvas.toDataURL("image/png"); 
        img.classList.add("pdf-image");
        chatContainer.appendChild(img);
    }
});
