const letters = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

let ch = '';
let i = 0;
let flag = false;
let s = '';
let ch1 = '';

function error() {
    flag = true;
}

function readCh() {
    if (i < s.length) {
        ch = s[i];
        i += 1;
    } else {
        ch = '';
    }
}

function readCh1() {
    const listBox = document.getElementById('listBox1');
    if (i < listBox.options.length) {
        ch1 = listBox.options[i].text;
        i += 1;
    } else {
        ch1 = '';
    }
}

function var1() {
    const memoLines = document.getElementById('memo1').value.split('\n');
    for (let j = 0; j < memoLines.length; j++) {
        if (ch1 === memoLines[j].trim()) {
            return true;
        }
    }
    return false;
}

function V() {
    if (letters.includes(ch) || digits.includes(ch) || ch === '_') {
        readCh();
    } else {
        error();
    }
    while (letters.includes(ch) || digits.includes(ch) || ch === '_') {
        readCh();
    }
}

function E() {
    if (var1()) {
        readCh1();
    } else if (ch1 === 'not') {
        readCh1();
        E();
    } else if (ch1 === '(') {
        readCh1();
        E();
        if (ch1 === ')') {
            readCh1();
        } else {
            error();
        }
    } else {
        error();
    }
    while (ch1 === 'and' || ch1 === 'or') {
        readCh1();
        E();
    }
}

function O() {
    if (ch1 === 'if') {
        readCh1();
    } else {
        error();
    }
    E();
    if (ch1 === 'then') {
        readCh1();
    } else {
        error();
    }
    if (ch1 === '$$$') {
        readCh1();
    } else if (ch1 === 'if') {
        O();
    } else {
        error();
    }
    if (ch1 === '@@@') {
        // End of expression
    } else if (ch1 === 'else') {
        readCh1();
        if (ch1 === '$$$') {
            readCh1();
        } else if (ch1 === 'if') {
            O();
        } else {
            error();
        }
    } else {
        error();
    }
}

function resetForm() {
    document.getElementById('memo1').value = '';
    document.getElementById('edit1').value = 'if not (i or j) then $$$ else $$$';
    document.getElementById('label1').innerText = 'Ожидание';
    flag = false;
    i = 0;
    const listBox = document.getElementById('listBox1');
    listBox.innerHTML = '';
}

function razb() {
    const edit1Value = document.getElementById('edit1').value + ' ';
    let s1 = '';
    const listBox = document.getElementById('listBox1');
    listBox.innerHTML = '';
    for (let i = 0; i < edit1Value.length; i++) {
        const c = edit1Value[i];
        if (!['(', ')', ' '].includes(c)) {
            s1 += c;
        } else {
            if (['(', ')'].includes(c)) {
                if (s1 !== '') {
                    const option = document.createElement('option');
                    option.text = s1;
                    listBox.add(option);
                    s1 = '';
                }
                const option = document.createElement('option');
                option.text = c;
                listBox.add(option);
            }
            if (c === ' ') {
                if (s1 !== '') {
                    const option = document.createElement('option');
                    option.text = s1;
                    listBox.add(option);
                    s1 = '';
                }
            }
        }
    }
    if (s1 !== '') {
        const option = document.createElement('option');
        option.text = s1;
        listBox.add(option);
    }
    const optionEnd = document.createElement('option');
    optionEnd.text = '@@@';
    listBox.add(optionEnd);
}

function parseExpression() {
    flag = false;
    const memoLines = document.getElementById('memo1').value.split('\n');
    for (let j = 0; j < memoLines.length; j++) {
        if (flag) break;
        s = memoLines[j] + '@';
        if (['and@', 'or@', 'not@', 'if@', 'then@', 'else@'].includes(s)) {
            flag = true;
            break;
        }
        i = 0;
        readCh();
        while (!flag && ch !== '@') {
            V();
        }
    }
    if (!flag) {
        razb();
        i = 0;
        readCh1();
        while (!flag && ch1 !== '@@@') {
            O();
        }
    }
    if (flag) {
        document.getElementById('label1').innerText = 'Ошибка';
    } else {
        document.getElementById('label1').innerText = 'Верно!';
    }
}