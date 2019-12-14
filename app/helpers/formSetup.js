const uuidv4 = require('uuid/v4');

exports.formSetup = (form, data, type) => {
    form.on('fileBegin', function (name, file){
        file.path = type ? './public/pictures/' + type + '/' + uuidv4() + '.' + file.name.split('.').pop() : undefined;
    });
    form.on('field', function(name, value) {
        if(data[name]){
            if(!Array.isArray(data[name])){
                data[name] = [data[name]];
            }
            data[name].push(value);
        } else {
            data[name] = value;
        }
    });
    form.on('file', function(field, file) {
        const fileName = file.path.substring(file.path.lastIndexOf('/') + 1);
        data['picture'] = type ? 'http://18.219.69.152:8080/' + type + '/' + fileName : undefined;
    });
};
