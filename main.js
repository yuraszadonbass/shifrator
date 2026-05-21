const Encryptor = {
    elements: {
        inputField: document.getElementById("input_field"),
        outputField: document.getElementById("output_field"),
        keyField: document.getElementById("key_field"),
        ciphersList: document.getElementById("ciphers_list"),
        encryptButton: document.getElementById("encrypt_button"),
        errorMessage: document.getElementById("error_message"),
        copyButton: document.getElementById("copy_button"),
        notificationElem: document.getElementById("copied_notification")
    },
    values: {
        inputValue: "",
        outputValue: "",
        keyValue: "",
        chosenCipher: 0,
    },
    // Методы объекта
    initialize() {
        this.elements.encryptButton.addEventListener("click", this.Cipher.bind(this));
        this.elements.ciphersList.addEventListener("change", this.changeKeyFieldState.bind(this));
        this.elements.copyButton.addEventListener("click", this.copyResult.bind(this));
    },

    copyResult() {
        // Копирование результата шифрования в буфер обмена пользователя
        navigator.clipboard.writeText(this.elements.outputField.value);

        let notifEl = this.elements.notificationElem;
        
        // Показ сообщения о копировании на 1 секунду
        notifEl.classList.remove("alert-hidden");
        setTimeout(function() {
            notifEl.classList.add("alert-hidden")
        }, 1500);
    },

    changeKeyFieldState() {
        console.log("list action");
        this.getInputValues();
        let field = this.elements.keyField;
        if (this.values.chosenCipher == 0 || this.values.chosenCipher == 1) {
            field.disabled = false;
            if (field.classList.contains("key-input-disabled")) {
                field.classList.remove("key-input-disabled");
            }
        } else {
            this.elements.keyField.disabled = true;
            if (!field.classList.contains("key-input-disabled")) {
                field.classList.add("key-input-disabled");
            }
        }
    },

    getInputValues() {
        this.values.inputValue = this.elements.inputField.value;
        this.values.keyValue = this.elements.keyField.value;
        this.values.chosenCipher = this.elements.ciphersList.value;
    },

    clear() {
        this.elements.errorMessage.textContent = "";
        this.elements.outputField.textContent = "";
    },

    validateKey() {
        return /^[1-9]\d*$/.test(this.values.keyValue);
    },

    validate(num, input) {
        console.log("validation", num);
        if(num == -1) {
            this.elements.errorMessage.textContent = "! Выберите шиф.";
            return false;
        } else if(num in [0, 1] && !this.validateKey()) {
            this.elements.errorMessage.textContent = "! Ключ шифра должен быть натуральным числом.";
            return false;
        } else if (num == 4 && !(/^[a-zA-Z\s]+$/.test(input))) {
            this.elements.errorMessage.textContent = "! Для шифра Бэкона можно использовать только буквы латинского алфавита.";
            return false;
        }
        return true;
    },

    Cipher() {
        this.clear();
        this.getInputValues();
        let num = Number(this.values.chosenCipher);
        let input = this.values.inputValue;
        if(this.validate(num, input)) {
            // Вызов нужной функции шифровки
            if(num == 0 || num == 1) {
                console.log(encryptionFunctions[num]);  
               this.elements.outputField.textContent = encryptionFunctions[num](this.values.inputValue, this.values.keyValue);
            } else {
                console.log(encryptionFunctions[num], num);
                this.elements.outputField.textContent = encryptionFunctions[num](this.values.inputValue);
            }
        }
    },

    caesarEncrypt(text, shift) {
            shift = Number(shift);

            const lowerRu = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
            const upperRu = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
            const lowerEn = 'abcdefghijklmnopqrstuvwxyz';
            const upperEn = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

            const ruLen = lowerRu.length; // 33
            const enLen = lowerEn.length; // 26

            let result = '';

            for (const char of text) {
                let idx;

                idx = lowerRu.indexOf(char);
                if (idx !== -1) {
                    const newIdx = ((idx + shift) % ruLen + ruLen) % ruLen;
                    result += lowerRu[newIdx];
                    continue;
                }

                idx = upperRu.indexOf(char);
                if (idx !== -1) {
                    const newIdx = ((idx + shift) % ruLen + ruLen) % ruLen;
                    result += upperRu[newIdx];
                    continue;
                }

                idx = lowerEn.indexOf(char);
                if (idx !== -1) {
                    const newIdx = ((idx + shift) % enLen + enLen) % enLen;
                    result += lowerEn[newIdx];
                    continue;
                }

                idx = upperEn.indexOf(char);
                if (idx !== -1) {
                    const newIdx = ((idx + shift) % enLen + enLen) % enLen;
                    result += upperEn[newIdx];
                    continue;
                }

                result += char;
            }

            return result;
    },

    caesarBackward(text, shift) {
        shift = Number(shift);

        const lowerRu = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
        const upperRu = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
        const lowerEn = 'abcdefghijklmnopqrstuvwxyz';
        const upperEn = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const ruLen = lowerRu.length;
        const enLen = lowerEn.length;

        const shiftAmount = shift % ruLen;

        let result = '';

        for (const char of text) {
            let idx;

            idx = lowerRu.indexOf(char);
            if (idx !== -1) {
                const newIdx = ((idx - shift) % ruLen + ruLen) % ruLen;
                result += lowerRu[newIdx];
                continue;
            }

            idx = upperRu.indexOf(char);
            if (idx !== -1) {
                const newIdx = ((idx - shift) % ruLen + ruLen) % ruLen;
                result += upperRu[newIdx];
                continue;
            }

            idx = lowerEn.indexOf(char);
            if (idx !== -1) {
                const newIdx = ((idx - shift) % enLen + enLen) % enLen;
                result += lowerEn[newIdx];
                continue;
            }

            idx = upperEn.indexOf(char);
            if (idx !== -1) {
                const newIdx = ((idx - shift) % enLen + enLen) % enLen;
                result += upperEn[newIdx];
                continue;
            }

            result += char;
        }

        return result;
    },

    atbashEncrypt(text) {
        const lowerRu = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
        const upperRu = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
        const lowerEn = 'abcdefghijklmnopqrstuvwxyz';
        const upperEn = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const ruLastIdx = lowerRu.length - 1;
        const enLastIdx = lowerEn.length - 1;

        let result = '';

        for (const char of text) {
            let idx;

            idx = lowerRu.indexOf(char);
            if (idx !== -1) {
                result += lowerRu[ruLastIdx - idx];
                continue;
            }

            idx = upperRu.indexOf(char);
            if (idx !== -1) {
                result += upperRu[ruLastIdx - idx];
                continue;
            }

            idx = lowerEn.indexOf(char);
            if (idx !== -1) {
                result += lowerEn[enLastIdx - idx];
                continue;
            }

            idx = upperEn.indexOf(char);
            if (idx !== -1) {
                result += upperEn[enLastIdx - idx];
                continue;
            }

            result += char;
        }

        return result;
    },

    a1z26Encrypt(text, separator = '-') {
        const lowerRu = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
        const lowerEn = 'abcdefghijklmnopqrstuvwxyz';

        let result = '';
        let lastWasLetter = false;

        for (const char of text) {
            const lowerChar = char.toLowerCase();
            let idx = lowerRu.indexOf(lowerChar);
            if (idx !== -1) {
                // русская буква
                const num = idx + 1;
                if (lastWasLetter) {
                    result += separator;
                }
                result += num;
                lastWasLetter = true;
                continue;
            }

            idx = lowerEn.indexOf(lowerChar);
            if (idx !== -1) {
                const num = idx + 1;
                if (lastWasLetter) {
                    result += separator;
                }
                result += num;
                lastWasLetter = true;
                continue;
            }

            result += char;
            lastWasLetter = false;
        }

        return result;
    },

    baconEncrypt(text, separator = ' ') {
        const baconMap = {
            a: 'AAAAA', b: 'AAAAB', c: 'AAABA', d: 'AAABB', e: 'AABAA',
            f: 'AABAB', g: 'AABBA', h: 'AABBB', i: 'ABAAA', j: 'ABAAB',
            k: 'ABABA', l: 'ABABB', m: 'ABBAA', n: 'ABBAB', o: 'ABBBA',
            p: 'ABBBB', q: 'BAAAA', r: 'BAAAB', s: 'BAABA', t: 'BAABB',
            u: 'BABAA', v: 'BABAB', w: 'BABBA', x: 'BABBB', y: 'BBAAA',
            z: 'BBAAB'
        };

        let result = '';
        let lastWasLetter = false;

        for (const char of text) {
            const lower = char.toLowerCase();
            const code = baconMap[lower];

            if (code) {
                if (lastWasLetter) {
                    result += separator;
                }
                result += code;
                lastWasLetter = true;
            } else {
                result += char;
                lastWasLetter = false;
            }
        }

        return result;
    },
}

Encryptor.initialize();

encryptionFunctions = [
    Encryptor.caesarEncrypt,
    Encryptor.caesarBackward,
    Encryptor.atbashEncrypt,
    Encryptor.a1z26Encrypt,
    Encryptor.baconEncrypt
]

/*
0 Цезарь
1 Цезарь назад
2 Атбаш
3 A1Z26
4 Бэкон

*/
