/**
 * @name setProps
 * @description Set the ityped properties configuration
 * @param {Object} config The configuration properties
 * @return {Promise}
 */
const setProps = ({
  typeSpeed = 100,
  backSpeed = 50,
  backDelay = 500,
  startDelay = 500,
  cursorChar = '|',
  showCursor = true,
  disableBackTyping = false,
  onFinished = function () { },
  loop = true
}) => ({
  typeSpeed,
  backSpeed,
  cursorChar,
  backDelay,
  startDelay,
  showCursor,
  loop,
  disableBackTyping,
  onFinished
})

export const init = (element, properties) => {
    let i = 0, l, WORK_TO_DO;
    let state = {}; // {id: {pos: number}}
    let text = "";
    
    const typewrite = (work, props) => {
        if (i === 1)
            if (props.loop) i = 0;
        setTimeout(() => { typeString(work, props); }, props.startDelay);
    }

    const typeString = (work, props) => {
        let index = 0;
        let workLen = work.length;
        let intervalID = setInterval(() => {
            doWork(work[index++], props);
            if (index === workLen) {
                onStringTyped(intervalID, props);
            }
        }, props.typeSpeed);
    }

    const makeSpans = () => {
        let result = [];
        for (let i = 0; i < text.length; i++) {
            let span = document.createElement("span");
            span.textContent = text[i];
            result.push(span);
        }
        return result;
    }

    const doWork = (workArray, props) => {
        workArray.forEach(work => {
            let id = `${work.id}`;
            if (!state[id]) {
                state[id] = {pos: 0};
            }

            if (work.append !== undefined) {
                let before = text.slice(0, state[id].pos);
                let after = text.slice(state[id].pos);
                text = before + work.append + after;
                state[id].pos++;
                Object.keys(state).forEach(key => {
                    if (key === id) {return;}
                    if (state[key].pos >= state[id].pos)
                        state[key].pos++;
                });
            }
            if (work.goto !== undefined) {
                state[id].pos = work.goto;
            }
            if (work.backspace !== undefined) {
                let before = text.slice(0, state[id].pos - 1);
                let after = text.slice(state[id].pos);
                text = before + after;
                state[id].pos--;
                Object.keys(state).forEach(key => {
                    if (key === id) {return;}
                    if (state[key].pos >= state[id].pos)
                        state[key].pos--;
                });
                
            }
        });
        while (element.lastChild) {
            element.lastChild.remove();
        }
        makeSpans().forEach(s => 
            element.appendChild(s)
        )
        positionCursors();
    }
 
    const onStringTyped = (id, props) => {
        clearInterval(id);
        if (props.disableBackTyping) {
            return props.onFinished()
        }
        if (!props.loop) {
            return props.onFinished();
        }
        setTimeout(() => eraseString(props), props.backDelay);
    }

    const eraseString = (props) => {
        let w = [{id: 0, backspace: 1}]
        let intervalID = setInterval(() => {
            doWork(w, props);
            if (text.length === 0) return onStringErased(intervalID, props);
        }, props.backSpeed);
    }

    const clearState = () => {
        Object.keys(state).forEach(key => {
            let s = state[key];
            if (s.cursor) {
                s.cursor.remove();
                s.cursor = null;
            }
        });
        state = {};
        text = "";
    }

    const onStringErased = (id, props) => {
        clearInterval(id);
        ++i;
        clearState();
        typewrite(WORK_TO_DO, props);
    }

    const positionCursors = () => {
        let eRect = element.parentNode.getBoundingClientRect();
        Object.keys(state).forEach(key => {
            let s = state[key];
            if (!s.cursor) {
                s.cursor = document.createElement('span');
                s.cursor.classList.add('ityped-cursor');
                s.cursor.classList.add(`ityped-cursor-${key}`);
                s.cursor.textContent = "|";
                s.cursor.width = "0";
                s.cursor.style.position = "relative";
                s.cursor.style.fontWeight = 800;
                let cursors = document.querySelector("#ityped-cursors");
                cursors.appendChild(s.cursor);
            }
            let span = s.pos === 0 ? null : element.childNodes[s.pos - 1];
            let rect = span ? span.getBoundingClientRect() : {right: eRect.left}
            let cRect = s.cursor.getBoundingClientRect();
            let keyNum = parseFloat(key);
            s.cursor.style.left = `${rect.right - (cRect.width * 0.5) - (keyNum * cRect.width) - eRect.left}px`;
            s.cursor.style.top = `${rect.top - eRect.top}px`;
            s.cursor.style.height = `${eRect.height}px`;
        })
    }
        
    const startTyping = (prop) => {
        let props = setProps(prop || {})
        let work = prop.work

        WORK_TO_DO = work;
        if (typeof element === "string") element = document.querySelector(element)
        // if (props.showCursor) setCursor(element, props)
        typewrite(WORK_TO_DO, props)
    }
    return startTyping(properties)
}

// window.ityped = {init};
