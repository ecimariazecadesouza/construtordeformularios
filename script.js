class FormBuilder {
    constructor() {
        this.fields = [];
        this.fieldCounter = 0;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Add field buttons
        document.querySelectorAll('.field-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fieldType = e.currentTarget.dataset.type;
                this.addField(fieldType);
            });
        });

        // Preview button
        document.getElementById('preview-btn').addEventListener('click', () => {
            this.showPreview();
        });

        // Close preview
        document.getElementById('close-preview').addEventListener('click', () => {
            this.hidePreview();
        });

        // Publish button
        document.getElementById('publish-btn').addEventListener('click', () => {
            this.showPublishModal();
        });

        // Close modal
        document.getElementById('close-modal').addEventListener('click', () => {
            this.hidePublishModal();
        });

        // Generate link
        document.getElementById('generate-link').addEventListener('click', () => {
            this.generateFormLink();
        });

        // Copy link
        document.getElementById('copy-link').addEventListener('click', () => {
            this.copyFormLink();
        });

        // Close modal when clicking outside
        document.getElementById('publish-modal').addEventListener('click', (e) => {
            if (e.target.id === 'publish-modal') {
                this.hidePublishModal();
            }
        });
    }

    addField(type) {
        this.fieldCounter++;
        const fieldId = `field_${this.fieldCounter}`;
        
        const field = {
            id: fieldId,
            type: type,
            label: this.getDefaultLabel(type),
            required: false,
            options: type === 'radio' || type === 'checkbox' || type === 'select' ? ['Opção 1'] : null
        };

        this.fields.push(field);
        this.renderField(field);
    }

    getDefaultLabel(type) {
        const labels = {
            text: 'Pergunta de texto curto',
            textarea: 'Pergunta de texto longo',
            radio: 'Pergunta de múltipla escolha',
            checkbox: 'Pergunta de caixas de seleção',
            select: 'Pergunta de lista suspensa',
            email: 'Endereço de e-mail',
            tel: 'Número de telefone',
            date: 'Data',
            number: 'Número'
        };
        return labels[type] || 'Nova pergunta';
    }

    renderField(field) {
        const container = document.getElementById('form-fields');
        const fieldElement = document.createElement('div');
        fieldElement.className = 'field-container';
        fieldElement.dataset.fieldId = field.id;

        fieldElement.innerHTML = this.getFieldHTML(field);
        container.appendChild(fieldElement);

        this.bindFieldEvents(fieldElement, field);
    }

    getFieldHTML(field) {
        let contentHTML = '';
        
        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'number':
                contentHTML = `<input type="${field.type}" class="field-input" placeholder="Resposta curta" disabled>`;
                break;
            case 'textarea':
                contentHTML = `<textarea class="field-input" placeholder="Resposta longa" disabled rows="3"></textarea>`;
                break;
            case 'date':
                contentHTML = `<input type="date" class="field-input" disabled>`;
                break;
            case 'radio':
                contentHTML = this.getRadioHTML(field);
                break;
            case 'checkbox':
                contentHTML = this.getCheckboxHTML(field);
                break;
            case 'select':
                contentHTML = this.getSelectHTML(field);
                break;
        }

        return `
            <div class="field-header">
                <input type="text" class="field-label" value="${field.label}" placeholder="Pergunta">
                <div class="field-actions">
                    <button class="field-action-btn" data-action="required" title="Obrigatório">
                        <i class="fas fa-asterisk ${field.required ? 'text-red' : ''}"></i>
                    </button>
                    <button class="field-action-btn" data-action="duplicate" title="Duplicar">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="field-action-btn" data-action="delete" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="field-content">
                ${contentHTML}
            </div>
        `;
    }

    getRadioHTML(field) {
        let html = '<div class="options-container">';
        field.options.forEach((option, index) => {
            html += `
                <div class="option-item">
                    <input type="radio" name="${field.id}" disabled>
                    <input type="text" class="option-input" value="${option}" data-index="${index}">
                    <button class="remove-option" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
        html += `
            <button class="add-option">
                <i class="fas fa-plus"></i>
                <span>Adicionar opção</span>
            </button>
        </div>`;
        return html;
    }

    getCheckboxHTML(field) {
        let html = '<div class="options-container">';
        field.options.forEach((option, index) => {
            html += `
                <div class="option-item">
                    <input type="checkbox" disabled>
                    <input type="text" class="option-input" value="${option}" data-index="${index}">
                    <button class="remove-option" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
        html += `
            <button class="add-option">
                <i class="fas fa-plus"></i>
                <span>Adicionar opção</span>
            </button>
        </div>`;
        return html;
    }

    getSelectHTML(field) {
        let html = '<div class="options-container">';
        html += '<select class="field-input" disabled>';
        field.options.forEach(option => {
            html += `<option>${option}</option>`;
        });
        html += '</select>';
        
        field.options.forEach((option, index) => {
            html += `
                <div class="option-item">
                    <span>Opção ${index + 1}:</span>
                    <input type="text" class="option-input" value="${option}" data-index="${index}">
                    <button class="remove-option" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
        html += `
            <button class="add-option">
                <i class="fas fa-plus"></i>
                <span>Adicionar opção</span>
            </button>
        </div>`;
        return html;
    }

    bindFieldEvents(fieldElement, field) {
        // Label change
        const labelInput = fieldElement.querySelector('.field-label');
        labelInput.addEventListener('input', (e) => {
            field.label = e.target.value;
        });

        // Field actions
        fieldElement.querySelectorAll('.field-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleFieldAction(action, field, fieldElement);
            });
        });

        // Options events (for radio, checkbox, select)
        if (field.options) {
            this.bindOptionEvents(fieldElement, field);
        }

        // Click to focus
        fieldElement.addEventListener('click', () => {
            document.querySelectorAll('.field-container').forEach(el => {
                el.classList.remove('active');
            });
            fieldElement.classList.add('active');
        });
    }

    bindOptionEvents(fieldElement, field) {
        // Option input changes
        fieldElement.querySelectorAll('.option-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.index);
                field.options[index] = e.target.value;
                this.updateSelectPreview(fieldElement, field);
            });
        });

        // Remove option
        fieldElement.querySelectorAll('.remove-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                if (field.options.length > 1) {
                    field.options.splice(index, 1);
                    this.rerenderField(field);
                }
            });
        });

        // Add option
        const addBtn = fieldElement.querySelector('.add-option');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                field.options.push(`Opção ${field.options.length + 1}`);
                this.rerenderField(field);
            });
        }
    }

    updateSelectPreview(fieldElement, field) {
        if (field.type === 'select') {
            const select = fieldElement.querySelector('select');
            if (select) {
                select.innerHTML = '';
                field.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.textContent = option;
                    select.appendChild(optionElement);
                });
            }
        }
    }

    rerenderField(field) {
        const fieldElement = document.querySelector(`[data-field-id="${field.id}"]`);
        if (fieldElement) {
            fieldElement.innerHTML = this.getFieldHTML(field);
            this.bindFieldEvents(fieldElement, field);
        }
    }

    handleFieldAction(action, field, fieldElement) {
        switch (action) {
            case 'required':
                field.required = !field.required;
                const asterisk = fieldElement.querySelector('[data-action="required"] i');
                asterisk.style.color = field.required ? '#ea4335' : '#666';
                break;
            case 'duplicate':
                this.duplicateField(field);
                break;
            case 'delete':
                this.deleteField(field, fieldElement);
                break;
        }
    }

    duplicateField(originalField) {
        const newField = {
            ...originalField,
            id: `field_${++this.fieldCounter}`,
            label: originalField.label + ' (cópia)',
            options: originalField.options ? [...originalField.options] : null
        };
        this.fields.push(newField);
        this.renderField(newField);
    }

    deleteField(field, fieldElement) {
        if (confirm('Tem certeza que deseja excluir este campo?')) {
            this.fields = this.fields.filter(f => f.id !== field.id);
            fieldElement.remove();
        }
    }

    showPreview() {
        const previewPanel = document.getElementById('preview-panel');
        const previewContent = document.getElementById('preview-content');
        
        previewContent.innerHTML = this.generatePreviewHTML();
        previewPanel.classList.remove('hidden');
        previewPanel.classList.add('show');
    }

    hidePreview() {
        const previewPanel = document.getElementById('preview-panel');
        previewPanel.classList.remove('show');
        setTimeout(() => {
            previewPanel.classList.add('hidden');
        }, 300);
    }

    generatePreviewHTML() {
        const formTitle = document.getElementById('form-title').value;
        const formDescription = document.getElementById('form-description').value;

        let html = `
            <div style="max-width: 600px; margin: 0 auto;">
                <h1 style="font-size: 2rem; margin-bottom: 0.5rem; color: #333;">${formTitle}</h1>
                ${formDescription ? `<p style="color: #666; margin-bottom: 2rem;">${formDescription}</p>` : ''}
                <form>
        `;

        this.fields.forEach(field => {
            html += `
                <div style="margin-bottom: 2rem; padding: 1.5rem; border: 1px solid #dadce0; border-radius: 8px;">
                    <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: #333;">
                        ${field.label}${field.required ? ' *' : ''}
                    </label>
                    ${this.getPreviewFieldHTML(field)}
                </div>
            `;
        });

        html += `
                    <button type="submit" style="background: #4285f4; color: white; padding: 0.75rem 2rem; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer;">
                        Enviar
                    </button>
                </form>
            </div>
        `;

        return html;
    }

    getPreviewFieldHTML(field) {
        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'number':
                return `<input type="${field.type}" style="width: 100%; padding: 0.75rem; border: 1px solid #dadce0; border-radius: 4px;" ${field.required ? 'required' : ''}>`;
            case 'textarea':
                return `<textarea style="width: 100%; padding: 0.75rem; border: 1px solid #dadce0; border-radius: 4px; min-height: 100px;" ${field.required ? 'required' : ''}></textarea>`;
            case 'date':
                return `<input type="date" style="width: 100%; padding: 0.75rem; border: 1px solid #dadce0; border-radius: 4px;" ${field.required ? 'required' : ''}>`;
            case 'radio':
                return field.options.map(option => `
                    <div style="margin: 0.5rem 0;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: normal;">
                            <input type="radio" name="${field.id}" value="${option}" ${field.required ? 'required' : ''}>
                            ${option}
                        </label>
                    </div>
                `).join('');
            case 'checkbox':
                return field.options.map(option => `
                    <div style="margin: 0.5rem 0;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: normal;">
                            <input type="checkbox" name="${field.id}" value="${option}">
                            ${option}
                        </label>
                    </div>
                `).join('');
            case 'select':
                return `
                    <select style="width: 100%; padding: 0.75rem; border: 1px solid #dadce0; border-radius: 4px;" ${field.required ? 'required' : ''}>
                        <option value="">Selecione uma opção</option>
                        ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                    </select>
                `;
            default:
                return '';
        }
    }

    showPublishModal() {
        document.getElementById('publish-modal').classList.remove('hidden');
    }

    hidePublishModal() {
        document.getElementById('publish-modal').classList.add('hidden');
    }

    generateFormLink() {
        const sheetUrl = document.getElementById('sheet-url').value;
        const sheetName = document.getElementById('sheet-name').value || 'Planilha1';

        if (!sheetUrl) {
            alert('Por favor, insira a URL da planilha Google Sheets.');
            return;
        }

        // Extract sheet ID from URL
        const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (!sheetIdMatch) {
            alert('URL da planilha inválida. Verifique se é um link válido do Google Sheets.');
            return;
        }

        const sheetId = sheetIdMatch[1];
        
        // Generate form data
        const formData = {
            title: document.getElementById('form-title').value,
            description: document.getElementById('form-description').value,
            fields: this.fields,
            sheetId: sheetId,
            sheetName: sheetName
        };

        // Create form HTML
        const formHTML = this.generateFormHTML(formData);
        
        // Save form to file
        this.saveFormToFile(formHTML, formData);
    }

    generateFormHTML(formData) {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa; padding: 2rem 1rem; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; margin-bottom: 0.5rem; }
        .description { color: #666; margin-bottom: 2rem; }
        .field { margin-bottom: 2rem; }
        label { display: block; font-weight: 500; margin-bottom: 0.5rem; color: #333; }
        input, textarea, select { width: 100%; padding: 0.75rem; border: 1px solid #dadce0; border-radius: 4px; font-size: 1rem; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #4285f4; }
        .radio-group, .checkbox-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .radio-item, .checkbox-item { display: flex; align-items: center; gap: 0.5rem; }
        .radio-item input, .checkbox-item input { width: auto; }
        .radio-item label, .checkbox-item label { font-weight: normal; margin: 0; }
        .submit-btn { background: #4285f4; color: white; padding: 0.75rem 2rem; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; margin-top: 1rem; }
        .submit-btn:hover { background: #3367d6; }
        .success-message { background: #d4edda; color: #155724; padding: 1rem; border-radius: 4px; margin-top: 1rem; display: none; }
        .error-message { background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 4px; margin-top: 1rem; display: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${formData.title}</h1>
        ${formData.description ? `<p class="description">${formData.description}</p>` : ''}
        
        <form id="form">
            ${formData.fields.map(field => this.generateFormFieldHTML(field)).join('')}
            
            <button type="submit" class="submit-btn">Enviar</button>
        </form>
        
        <div id="success-message" class="success-message">
            Formulário enviado com sucesso! Obrigado pela sua resposta.
        </div>
        
        <div id="error-message" class="error-message">
            Erro ao enviar formulário. Tente novamente.
        </div>
    </div>

    <script>
        document.getElementById('form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                if (data[key]) {
                    if (Array.isArray(data[key])) {
                        data[key].push(value);
                    } else {
                        data[key] = [data[key], value];
                    }
                } else {
                    data[key] = value;
                }
            }
            
            // Add timestamp
            data.timestamp = new Date().toLocaleString('pt-BR');
            
            try {
                // Send to Google Sheets via Google Apps Script
                const response = await fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sheetId: '${formData.sheetId}',
                        sheetName: '${formData.sheetName}',
                        data: data
                    })
                });
                
                document.getElementById('success-message').style.display = 'block';
                document.getElementById('error-message').style.display = 'none';
                this.reset();
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('error-message').style.display = 'block';
                document.getElementById('success-message').style.display = 'none';
            }
        });
    </script>
</body>
</html>`;
    }

    generateFormFieldHTML(field) {
        let html = `<div class="field">
            <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>`;

        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'number':
            case 'date':
                html += `<input type="${field.type}" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>`;
                break;
            case 'textarea':
                html += `<textarea id="${field.id}" name="${field.id}" rows="4" ${field.required ? 'required' : ''}></textarea>`;
                break;
            case 'radio':
                html += `<div class="radio-group">`;
                field.options.forEach((option, index) => {
                    html += `
                        <div class="radio-item">
                            <input type="radio" id="${field.id}_${index}" name="${field.id}" value="${option}" ${field.required ? 'required' : ''}>
                            <label for="${field.id}_${index}">${option}</label>
                        </div>
                    `;
                });
                html += `</div>`;
                break;
            case 'checkbox':
                html += `<div class="checkbox-group">`;
                field.options.forEach((option, index) => {
                    html += `
                        <div class="checkbox-item">
                            <input type="checkbox" id="${field.id}_${index}" name="${field.id}" value="${option}">
                            <label for="${field.id}_${index}">${option}</label>
                        </div>
                    `;
                });
                html += `</div>`;
                break;
            case 'select':
                html += `<select id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>
                    <option value="">Selecione uma opção</option>`;
                field.options.forEach(option => {
                    html += `<option value="${option}">${option}</option>`;
                });
                html += `</select>`;
                break;
        }

        html += `</div>`;
        return html;
    }

    saveFormToFile(formHTML, formData) {
        // Create a blob with the HTML content
        const blob = new Blob([formHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `formulario_${formData.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show success modal
        this.hidePublishModal();
        this.showSuccessModal(a.download);
    }

    showSuccessModal(filename) {
        const modal = document.getElementById('success-modal');
        const linkInput = document.getElementById('form-link');
        linkInput.value = `Arquivo baixado: ${filename}`;
        modal.classList.remove('hidden');
    }

    copyFormLink() {
        const linkInput = document.getElementById('form-link');
        linkInput.select();
        document.execCommand('copy');
        
        const copyBtn = document.getElementById('copy-link');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }
}

// Close success modal function
function closeSuccessModal() {
    document.getElementById('success-modal').classList.add('hidden');
}

// Initialize the form builder when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FormBuilder();
});

