let urlProcessdata = 'http://3.72.208.221:8090/processdata/projects';
async function fetchData(url) {
try {
    const response = await axios.get(url);
    return response.data;
} catch (error) {
    console.error('Error fetching data:', error);
    return [];
}
}

async function populateOptions(fieldId, url) {
const dataList = document.getElementById(fieldId);
dataList.value = '';
const data = await fetchData(url);
data.forEach(option => {
    if (typeof option === "string") {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        dataList.appendChild(optionElement);
    }
});
}

populateOptions(
'datalistProject',
urlProcessdata);

const inputFieldProject = document.getElementById('inputFieldProject');
inputFieldProject.addEventListener('input', function() {
const selectedProjectName = inputFieldProject.value;
populateOptions('datalistTP',
    `${urlProcessdata}/${encodeURIComponent(selectedProjectName)}/tp`);
});

const inputFieldTP = document.getElementById('inputFieldTP');
inputFieldTP.addEventListener('input', function() {
const selectedProjectName = inputFieldProject.value;
const selectedTP = inputFieldTP.value;
populateOptions(
    'datalistVersion',
    `${urlProcessdata}/${encodeURIComponent(selectedProjectName)}/tp/${encodeURIComponent(selectedTP)}/versions`);
});

    function getParameters(){
    let projectName = document.getElementById('inputFieldProject').value;
    let tp = document.getElementById('inputFieldTP').value;
    let version = document.getElementById('inputFieldVersion').value;

    console.log(projectName, tp, version);
    }
    document.addEventListener('dblclick', getParameters);
