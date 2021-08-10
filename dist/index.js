/**
    * @name ityped
    * @description Dead simple Animated Typing with no dependencies
    * @author Luis Vinícius
    * @email luisviniciusbarreto@gmail.com
    */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.ityped = {})));
}(this, (function (exports) { 'use strict';

/**
 * @name setProps
 * @description Set the ityped properties configuration
 * @param {Object} config The configuration properties
 * @return {Promise}
 */
var setProps = function setProps(_ref) {
    var _ref$typeSpeed = _ref.typeSpeed,
        typeSpeed = _ref$typeSpeed === undefined ? 100 : _ref$typeSpeed,
        _ref$backSpeed = _ref.backSpeed,
        backSpeed = _ref$backSpeed === undefined ? 50 : _ref$backSpeed,
        _ref$backDelay = _ref.backDelay,
        backDelay = _ref$backDelay === undefined ? 500 : _ref$backDelay,
        _ref$startDelay = _ref.startDelay,
        startDelay = _ref$startDelay === undefined ? 500 : _ref$startDelay,
        _ref$cursorChar = _ref.cursorChar,
        cursorChar = _ref$cursorChar === undefined ? '|' : _ref$cursorChar,
        _ref$showCursor = _ref.showCursor,
        showCursor = _ref$showCursor === undefined ? true : _ref$showCursor,
        _ref$disableBackTypin = _ref.disableBackTyping,
        disableBackTyping = _ref$disableBackTypin === undefined ? false : _ref$disableBackTypin,
        _ref$onFinished = _ref.onFinished,
        onFinished = _ref$onFinished === undefined ? function () {} : _ref$onFinished,
        _ref$loop = _ref.loop,
        loop = _ref$loop === undefined ? true : _ref$loop;
    return {
        typeSpeed: typeSpeed,
        backSpeed: backSpeed,
        cursorChar: cursorChar,
        backDelay: backDelay,
        startDelay: startDelay,
        showCursor: showCursor,
        loop: loop,
        disableBackTyping: disableBackTyping,
        onFinished: onFinished
    };
};

var init = function init(element, properties) {
    var i = 0,
        l = void 0,
        WORK_TO_DO = void 0;
    var state = {}; // {id: {pos: number}}
    var text = "";

    var typewrite = function typewrite(work, props) {
        if (i === 1) if (props.loop) i = 0;
        setTimeout(function () {
            typeString(work, props);
        }, props.startDelay);
    };

    var typeString = function typeString(work, props) {
        var index = 0;
        var workLen = work.length;
        var intervalID = setInterval(function () {
            doWork(work[index++], props);
            if (index === workLen) {
                onStringTyped(intervalID, props);
            }
        }, props.typeSpeed);
    };

    var makeSpans = function makeSpans() {
        var result = [];
        for (var _i = 0; _i < text.length; _i++) {
            var span = document.createElement("span");
            span.textContent = text[_i];
            result.push(span);
        }
        return result;
    };

    var doWork = function doWork(workArray, props) {
        workArray.forEach(function (work) {
            var id = "" + work.id;
            if (!state[id]) {
                state[id] = { pos: 0 };
            }

            if (work.append !== undefined) {
                var before = text.slice(0, state[id].pos);
                var after = text.slice(state[id].pos);
                text = before + work.append + after;
                state[id].pos++;
                Object.keys(state).forEach(function (key) {
                    if (key === id) {
                        return;
                    }
                    if (state[key].pos >= state[id].pos) state[key].pos++;
                });
            }
            if (work.goto !== undefined) {
                state[id].pos = work.goto;
            }
            if (work.backspace !== undefined) {
                var _before = text.slice(0, state[id].pos - 1);
                var _after = text.slice(state[id].pos);
                text = _before + _after;
                state[id].pos--;
                Object.keys(state).forEach(function (key) {
                    if (key === id) {
                        return;
                    }
                    if (state[key].pos >= state[id].pos) state[key].pos--;
                });
            }
        });
        while (element.lastChild) {
            element.lastChild.remove();
        }
        makeSpans().forEach(function (s) {
            return element.appendChild(s);
        });
        positionCursors();
    };

    var onStringTyped = function onStringTyped(id, props) {
        clearInterval(id);
        if (props.disableBackTyping) {
            return props.onFinished();
        }
        if (!props.loop) {
            return props.onFinished();
        }
        setTimeout(function () {
            return eraseString(props);
        }, props.backDelay);
    };

    var eraseString = function eraseString(props) {
        var w = [{ id: 0, backspace: 1 }];
        var intervalID = setInterval(function () {
            doWork(w, props);
            if (text.length === 0) return onStringErased(intervalID, props);
        }, props.backSpeed);
    };

    var clearState = function clearState() {
        Object.keys(state).forEach(function (key) {
            var s = state[key];
            if (s.cursor) {
                s.cursor.remove();
                s.cursor = null;
            }
        });
        state = {};
        text = "";
    };

    var onStringErased = function onStringErased(id, props) {
        clearInterval(id);
        ++i;
        clearState();
        typewrite(WORK_TO_DO, props);
    };

    var positionCursors = function positionCursors() {
        var eRect = element.parentNode.getBoundingClientRect();
        Object.keys(state).forEach(function (key) {
            var s = state[key];
            if (!s.cursor) {
                s.cursor = document.createElement('span');
                s.cursor.classList.add('ityped-cursor');
                s.cursor.classList.add("ityped-cursor-" + key);
                s.cursor.textContent = "|";
                s.cursor.width = "0";
                s.cursor.style.position = "relative";
                s.cursor.style.fontWeight = 800;
                var cursors = document.querySelector("#ityped-cursors");
                cursors.appendChild(s.cursor);
            }
            var span = s.pos === 0 ? null : element.childNodes[s.pos - 1];
            var rect = span ? span.getBoundingClientRect() : { right: 0 };
            var cRect = s.cursor.getBoundingClientRect();
            var keyNum = parseFloat(key);
            s.cursor.style.left = rect.right - cRect.width * 0.5 - keyNum * cRect.width - eRect.left + "px";
            s.cursor.style.top = rect.top - eRect.top + "px";
            s.cursor.style.height = eRect.height + "px";
        });
    };

    var startTyping = function startTyping(prop) {
        var props = setProps(prop || {});
        var work = prop.work;

        WORK_TO_DO = work;
        if (typeof element === "string") element = document.querySelector(element);
        // if (props.showCursor) setCursor(element, props)
        typewrite(WORK_TO_DO, props);
    };
    return startTyping(properties);
};

// window.ityped = {init};

exports.init = init;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
