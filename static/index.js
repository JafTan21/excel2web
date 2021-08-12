const socket = io();
const row_count = 100;
const col_coult = 10;
const table = document.getElementById('table');
const alpha = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'
];


const generateId = (row, col) => {
    return alpha[col] + "" + row;
}

for (var row = 1; row <= row_count; row++) {
    tr = document.createElement('tr');
    tr.id = row;

    for (var col = 0; col < col_coult; col++) {
        td = document.createElement('td');
        td.id = generateId(row, col);

        tr.appendChild(td);
        // console.log(col, row)
    }

    table.appendChild(tr);
}


document.getElementById("get_btn").addEventListener("click", () => {

    socket.emit('get-json');

});

const formatFormula = (f) => {
    // remove $
    let res = '';
    f.split("").forEach(c => {
        if (c != "$") res += c;
    });
    return res;
}

const applyFormula = (e) => {
    console.log(e.target.dataset.f);
    let formula = e.target.dataset.f;
    let cells = [""];
    let operators = [];

    for (let i = 0; i < formula.length; i++) {
        if (['*', '-', '+', '-'].includes(formula[i])) {
            operators.push(formula[i]);
            cells.push("");
        } else {
            cells.push(formula[i]);
        }
    }

    let arr = formula.split("+").join(" ").split("-").join(" ").split("/").join(" ").split("*");
    let exp = '';
    let op_i = 0;
    for (var i = 0; i < arr.length; i++) {
        if (isNaN(arr[i]) && document.querySelector(`#${arr[i]} input`)) {
            arr[i] = document.querySelector(`#${arr[i]} input`).value;


        }

        exp += arr[i];
        if (operators[op_i]) exp += operators[op_i++];
    }

    console.table([cells, operators, arr, formula, exp, math.evaluate(exp)]);
}

socket.on('send-json', (data) => {
    // console.log(data);
    // console.log(data.Sheets[data.SheetNames[0]]);
    data = data.Sheets[data.SheetNames[0]];
    for (const cell in data) {
        if (document.getElementById(cell)) {
            if (data[cell].f) {
                input = document.createElement('input');
                input.value = data[cell].v;
                input.dataset.f = formatFormula(data[cell].f);
                input.addEventListener("keydown", applyFormula);
                document.getElementById(cell).appendChild(input);
            } else {
                input = document.createElement('input');
                input.value = data[cell].v;
                input.setAttribute("disabled", true);
                document.getElementById(cell).appendChild(input);
            }
        }
        // console.log(cell, data);
    }
});


// to do
// make a functionality to get real time data if value update of A2 -> should affact a@ * 5