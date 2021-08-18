const socket = io();
const table = document.getElementById('table');
const alpha = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
];
var cells_with_formula = [];


const generateId = (row, col) => {
    return alpha[col] + "" + row;
}

const init = (row_count, col_count) => {
    for (var row = 1; row <= row_count; row++) {
        tr = document.createElement('tr');
        tr.id = row;

        for (var col = 0; col < col_count; col++) {
            td = document.createElement('td');
            td.id = generateId(row, col);

            tr.appendChild(td);
            // console.log(col, row)
        }

        table.appendChild(tr);
    }

    console.log(row_count, col_count);
}


const formatFormula = (f) => {
    // remove $
    let res = '';
    f.split("").forEach(c => {
        if (c != "$") res += c;
    });
    res = res
        .replace(/\(/g, ' ( ')
        .replace(/\)/g, ' ) ')
        .replace(/\+/g, ' + ')
        .replace(/\-/g, ' - ')
        .replace(/\*/g, ' * ')
        .replace(/\//g, ' / ')
        .replace(/\:/g, ' : ')

    return res;
}

const applyFormula = (e) => {
    let formula = e.target.dataset.f;
}

const recalculateValues = () => {

    cells_with_formula.forEach(cell => {
        cell = document.querySelector(`#${cell} input`);

        if (cell) {
            let formula = cell.dataset.f;
            let formula_arr = formula.split(" ");
            let exp = '';
            formula_arr.forEach(elm => {
                if (isNaN(elm) && document.getElementById(elm)) {
                    exp += document.querySelector(`#${elm} input`).value;
                } else {
                    exp += elm;
                }
            });
            console.log(exp)
            try {
                cell.value = math.evaluate(exp);
            } catch (error) {
                cell.value = '';
            }
        }
    });

}

const getRowCount = (limit) => {
    let arr = limit.split(":");
    let startingRow = arr[0].replace(/[^0-9]/g, '');
    let endingRow = arr[1].replace(/[^0-9]/g, '');
    // console.log(startingRow, endingRow, arr)
    return parseInt(endingRow) - parseInt(startingRow) + 1;
}
const getColCount = (limit) => {
    let arr = limit.split(":");
    let startingCol = arr[0].replace(/[^A-Z]/g, '');
    let endingCol = arr[1].replace(/[^A-Z]/g, '');
    let map = {};
    for (var i = 1; i <= 26; i++) {
        map[alpha[i - 1]] = i;
    }
    // console.log(startingCol, endingCol)
    return parseInt(map[endingCol]) - parseInt(map[startingCol]) + 1;
}

const regenerateAlpha = needed => {
    var prefix_index = 0;
    var prefix = alpha[prefix_index];
    var alpha_i = 0;
    for (var i = 0; i < needed; i++) {
        alpha.push(prefix + alpha[alpha_i]);
        alpha_i++;

        if (alpha_i == 26) {
            prefix_index++;
            prefix = alpha[prefix_index];
            alpha_i = 0;
        }
    }

    console.log(alpha);
}

socket.on('send-json', (data) => {
    // console.log(data);
    // console.log(data.Sheets[data.SheetNames[0]]);
    data = data.Sheets[data.SheetNames[0]];
    // console.log(data)

    if (getColCount(data["!ref"]) > 26) {
        regenerateAlpha(getColCount(data["!ref"]) - 26);
    }

    init(getRowCount(data["!ref"]), getColCount(data["!ref"]));
    for (const cell in data) {
        if (document.getElementById(cell)) {
            input = document.createElement('input');
            input.value = data[cell].v;
            input.dataset.value = data[cell].v;
            input.classList.add('form-control');
            input.dataset.disabled = "false";
            if (data[cell].f) {

                cells_with_formula.push(cell);
                input.dataset.f = formatFormula(data[cell].f);
                input.setAttribute("disabled", true);
                input.dataset.disabled = "true";
            } else {
                input.addEventListener("keyup", recalculateValues);
            }
            document.getElementById(cell).appendChild(input);
        }
    }
});


// to do
// make a functionality to get real time data if value update of A2 -> should affact a@ * 5