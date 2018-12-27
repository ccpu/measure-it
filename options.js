/*******************************************************************************
    Measure=it - A browser extension to measure parts of page.
    Copyright (C) 2017-2019 Trishul Goel

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/tsl143/measure-it
*******************************************************************************/

const saveData = (key, val) => {
	localStore.get('choices')
		.then((res = {}) => {
			const { choices } = res;
			choices[key] = val;
			localStore.set({ choices })
		});
}

const setVal = (key, val, saveToo = true) => {
	switch (key) {
		case 'background': {
			if(saveToo) saveData('background', val);
			document.getElementById('backgroundLabel').textContent = val;
			if(!saveToo) document.getElementById('background').value = val;
			break;
		}
		case 'popup': {
			if(saveToo) saveData('popup', val)
			document.getElementById('popupLabel').textContent = val;
			if(!saveToo) document.getElementById('popup').value = val;
			break;
		}
		case 'popupOpacity': {
			if(saveToo) saveData('popupOpacity', val);
			document.getElementById('popupOpacityLabel').textContent = val;
			if(!saveToo) document.getElementById('popupOpacity').value = val;
			break;
		}
		case 'backgroundOpacity': {
			if(saveToo) saveData('backgroundOpacity', val);
			document.getElementById('backgroundOpacityLabel').textContent = val;
			if(!saveToo) document.getElementById('backgroundOpacity').value = val;
			break;
		}
	}
}

localStore.get('choices')
	.then((res = {}) => {
		const { choices = {} } = res;
		setVal('background', choices.background, false);
		setVal('popup', choices.popup, false);
		setVal('popupOpacity', choices.popupOpacity, false);
		setVal('backgroundOpacity', choices.backgroundOpacity, false);
	});

document.getElementById('optionTable').addEventListener('change', e => {
	const ele = e.target;
	setVal(ele.getAttribute('id'), ele.value);
})

if (isFirefox) {
	const shortcutInput = document.getElementById('shortcutKey');
	let sKeys = 'Alt+Shift+M';

	try {
		if(navigator.platform.toUpperCase().includes('MAC')) sKeys = 'Command+Shift+O';
	} catch(e){}

	document.getElementById('shortcut').classList = "";
	localStore.get().then( res => {
		const { choices = {} } = res;
		shortcutInput.value = choices.shortcut || sKeys;
	})

	const handlekeyPress = e => {
		shortcutInput.value = '';
		const { ctrlKey, altKey,shiftKey, metaKey, key } = e;
		if (key == 'Backspace') {
			shortcutInput.value = '';
		} else if (!ctrlKey && !altKey && !metaKey) {
			shortcutInput.value = 'Atleast 1 modifer key';
		} else if (key.length > 1 || !key.match(/^[A-Za-z0-9]+$/)) {
			shortcutInput.value = 'Alphabet/number only';
		} else {
			const finalKeys = new Array;
			if(ctrlKey) finalKeys.push('Ctrl');
			if(altKey) finalKeys.push('Alt');
			if(shiftKey) finalKeys.push('Shift');
			if(metaKey) finalKeys.push('Command');
			finalKeys.push(key.toUpperCase());
			sKeys = finalKeys.join('+');
			shortcutInput.value = sKeys;
			browser.commands.update({
				name: '_execute_browser_action',
				shortcut: sKeys
			  });
		}
	}

	shortcutInput.addEventListener('keypress', handlekeyPress);
	shortcutInput.addEventListener('click', e => { shortcutInput.value = '' })
	shortcutInput.addEventListener('blur', e => { shortcutInput.value = sKeys })
}
