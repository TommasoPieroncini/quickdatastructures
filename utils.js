let outString = "\n";
let base = 0;
let language = "";
let tabs = "";

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function makeTabs(num) {
    let out = "";
    let add = "";
    if (language === 'java') {
        add = "\t";
    } else {
        add = " ";
    }
    for (var i = 0; i < num; i++) {
        out += add;
    }
    return out;
}

function LLNode() {
    if (language === 'java') {
        return "private class LLNode {\n\tpublic int data;\n\tpublic LLNode next;\n\n\tpublic LLNode(int data) {\n\t\tthis.data = data;\n\t}\n}\n\n";
    } else {
        return "class LLNode:\ndef __init__(self, data):\n\tself.data = data\n\t\tself.next = None\n\n";
    }
}

function BTNode() {
    if (language === 'java') {
        return "private class BTNode {\n\tpublic int data;\n\tpublic BTNode left;\n\tpublic BTNode right;\n\n\tpublic BTNode(int data) {\n\t\tthis.data = data;\n\t}\n}\n\n";
    } else {
        return "class BTNode:\n\tdef __init__(self, data):\n\tself.data = data\n\t\tself.right = None\n\t\tself.left = None\n\n";
    }
}

function newNode(nodeName, data, nodeType) {
    let out = "";
    if (language === 'java') {
        out = line(nodeType + " " + nodeName + " = new " + nodeType + "(" + data + ")");
    } else {
        out = line(nodeName + " = " + nodeType + "(" + data + ")");
    }
    return out;
}

function comment(comment) {
    let out = "";
    if (language === 'java') {
        out = "// " + comment + "\n";
    } else {
        out = "# " + comment + "\n";
    }
    return tabs + out;
}

function line(line) {
    let out = "";
    if (language === 'java') {
        out = line + ";\n";
    } else {
        out = line + "\n";
    }
    return tabs + out;
}

function genLL(numNodes, numNodesInCycle, minimum, maximum, sorted, genLLNodeClass, editor) {
    if (editor) {

        let nodeStr = "";

        // 'python' 'java' etc.
        language = editor.document.languageId;

        // automate spacing for generated code
        const cursorPos = editor.selection.active;
        tabs = makeTabs(cursorPos.character);
        
        if (genLLNodeClass) {
            nodeStr = LLNode();
        }

        let mData = new Array(numNodes);
        let interval = Math.floor((maximum - minimum) / numNodes);
        let data = Math.abs(minimum);
        for (var i = 0; i < numNodes; i++) {
            mData[i] = randomIntFromInterval(data + i * interval, data + (i + 1) * interval);
        }

        if (sorted !== "y" && sorted !== "yes") {
            shuffleArray(mData);
        }

        let mNodes = new Array(numNodes);
        var cycleStart = "";
        for (i = 0; i < numNodes; i++) {
            var nodeName = "node" + base++;
            mNodes[i] = nodeName;
            if (numNodes - numNodesInCycle == i)
                cycleStart = nodeName;
            outString += newNode(nodeName, mData[i], "LLNode");
        }

        for (i = 0; i < numNodes - 1; i++) {
            outString += line(mNodes[i] + ".next = " + mNodes[i + 1]);
        }

        if (numNodesInCycle != 0) {
            outString += line(mNodes[numNodes - 1] + ".next = " + cycleStart);
        }
        
        outString += comment("This is the head of a " + numNodes + " nodes Linked List, with " + numNodesInCycle + " nodes in a cycle");

        if (language === 'java') {
            outString += line("LLNode llHead" + mNodes[0] + " = " + mNodes[0]) + "\n";
        } else {
            outString += line("llHead" + mNodes[0] + " = " + mNodes[0]) + "\n";
        }

        editor.edit((tee) => {
            tee.insert(editor.document.positionAt(0), nodeStr);
            tee.insert(cursorPos, outString);
        });
        outString = "\n";
    } else {
        console.log("No editor selected.")
    }
}

function buildBinSearchTree(dataArr) {
    var mid = Math.floor(dataArr.length / 2);
    var nodeName = "node" + base;
    base += 1;
    outString += newNode(nodeName, dataArr[mid], "BTNode");
    if (dataArr.length === 1) {
        return nodeName;
    }
    var left = line(nodeName + ".left = " + buildBinSearchTree(dataArr.slice(0, mid)));
    outString += left;
    if (dataArr.length === 2) {
        return nodeName;
    }
    var right = line(nodeName + ".right = " + buildBinSearchTree(dataArr.slice(mid + 1, dataArr.length)));
    outString += right;
    return nodeName;
}

function genTree(numNodes, minimum, maximum, genClass, isBinSearch, editor) {
    if (editor) {

        let nodeStr = "";

        // 'python' 'java' etc.
        language = editor.document.languageId;
        
        // automate spacing for generated code
        const cursorPos = editor.selection.active;
        tabs = makeTabs(cursorPos.character);

        if (genClass === "y" || genClass === "yes") {
            nodeStr = BTNode();
        }

        let mData = new Array(numNodes);
        let interval = Math.floor((maximum - minimum) / numNodes);
        let data = Math.abs(minimum);
        for (var i = 0; i < numNodes; i++) {
            mData[i] = randomIntFromInterval(data + i * interval, data + (i + 1) * interval);
        }

        if (!isBinSearch) {
            shuffleArray(mData);
        }

        var root = buildBinSearchTree(mData, outString);

        // DEBUG
        // for (var line in printedTree) {
        //     outString += line;
        // }

        outString += comment("");
        outString += comment("");
        outString += comment("This is the root of a binary " + ((isBinSearch) ? "search " : "") + "tree with " + numNodes + " nodes.");
        if (language === 'java') {
            outString += line("BTNode treeRoot" + root + " = " + root) + "\n";
        } else {
            outString += line("treeRoot" + root + " = " + root) + "\n";
        }

        editor.edit((tee) => {
            tee.insert(editor.document.positionAt(0), nodeStr);
            tee.insert(cursorPos, outString);
        });
        outString = "\n";
    } else {
        console.log("No editor selected.")
    }
}

// module.exports.shuffleArray = shuffleArray;
// module.exports.randomIntFromInterval = randomIntFromInterval;
module.exports.genLL = genLL;
module.exports.genTree = genTree;