// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

let base = 0;

let outString = "";

// function uuidv4() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//         var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16);
//     });
// }

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function buildBinSearchTree(dataArr) {
    var mid = Math.floor(dataArr.length / 2);
    var nodeName = "node" + base;
    base += 1;
    outString += nodeName + " = Node(" + dataArr[mid] + ")\n";
    if (dataArr.length === 1) {
        return nodeName;
    }
    var left = nodeName + ".left = " + buildBinSearchTree(dataArr.slice(0, mid)) + "\n";
    outString += left;
    if (dataArr.length === 2) {
        return nodeName;
    }
    var right = nodeName + ".right = " + buildBinSearchTree(dataArr.slice(mid + 1, dataArr.length))  + "\n";
    outString += right;
    return nodeName;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "quickdatastructures" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let binSearch = vscode.commands.registerCommand('extension.genBinSearchTree', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        // vscode.window.showInformationMessage();

        vscode.window.showInputBox({prompt: 'Enter number of nodes in the tree'}).then((numNodes) => {
            vscode.window.showInputBox({prompt: 'Enter minimum data value (integer)'}).then((minimum) => {
                vscode.window.showInputBox({prompt: 'Enter maximum data value (integer)'}).then((maximum) => {

                    const editor = vscode.window.activeTextEditor;

                    if (editor) {
                        let myData = new Array(numNodes);
                        let interval = Math.floor((maximum - minimum) / numNodes);
                        let data = Math.abs(minimum);
                        for (var i = 0; i < numNodes; i++) {
                            myData[i] = randomIntFromInterval(data + i * interval, (i + 1) * interval);
                            data = myData[i];
                        }

                        var root = buildBinSearchTree(myData);
                        outString += "\ntreeroot" + root + " = " + root + "\n\n";

                        const cursorPos = editor.selection.active;
                        editor.edit((tee) => {
                            tee.insert(cursorPos, outString);
                        });
                        outString = "";
                    }
                }, (error) => {
                    console.log(error);
                });
            }, (error) => {
                console.log(error);
            });
        }, (error) => {
            console.log(error);
        });
    });

    let nodeObj = vscode.commands.registerCommand('extension.genNodeObject', function () {
        vscode.window.showInformationMessage('Python node object template');
    });

    let binTree = vscode.commands.registerCommand('extension.genBinTree', function () {
        vscode.window.showInformationMessage('Python binary tree');
    });

    context.subscriptions.push(nodeObj);
    context.subscriptions.push(binSearch);
    context.subscriptions.push(binTree);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;