// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const addRemove = vscode.commands.registerCommand('linter-maintainer.addRemoveESLintRules', addRemoveRules);
	const add = vscode.commands.registerCommand('linter-maintainer.addESLintRules', addRules);
	const remove = vscode.commands.registerCommand('linter-maintainer.removeESLintRules', removeRules);

	context.subscriptions.push(addRemove);
	context.subscriptions.push(add);
	context.subscriptions.push(remove);
}


async function updateESLintConfig() {
	let currentPath = vscode.window.activeTextEditor?.document.fileName;
	if (!currentPath) {
		vscode.window.showErrorMessage('No file is open');
		return;
	}

	const targetPath = await vscode.window.showQuickPick([
		currentPath,
		'Define by yourself',
	], {placeHolder: 'Select LinterMaintainer options', canPickMany: false});
	console.log(targetPath);
}

function addRemoveRules() {
	console.log('addRemoveRules');
	addRules();
	removeRules();
}

function addRules() {
	const addedRulesNum = 5;
	vscode.window.showInformationMessage(`Added ${addedRulesNum} rules`);
}

function removeRules() {
	const removedRulesNum = 5;
	vscode.window.showInformationMessage(`Removed ${removedRulesNum} rules`);
}



// this method is called when your extension is deactivated
export function deactivate() {}
