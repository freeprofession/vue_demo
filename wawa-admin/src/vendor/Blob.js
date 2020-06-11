/* eslint-disable */
require('script-loader!file-saver');
import XLSX from 'xlsx'

function importFile(data) { // 导入excel
    let obj = this.imFile
    if (!obj.files) {
      return
    }
    var rABS = false; //是否将文件读取为二进制字符串
    var f = obj.files[0]
    var reader = new FileReader()
    var wb; //读取完成的数据
    reader.onload = function (e) {
      var data = e.target.result
      if (rABS) {
        wb = XLSX.read(btoa(this.fixdata(data)), {  // 手动转化
          type: 'base64'
        })
      } else {
        wb = XLSX.read(data, {
          type: 'binary'
        })
      }
      let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]])
      console.log(typeof json)
      dealFile(analyzeData(json)) // analyzeData: 解析导入数据
    }
    if (rABS) {
      reader.readAsArrayBuffer(f)
    } else {
      reader.readAsBinaryString(f)
    }
}

function analyzeData (data) {  // 此处可以解析导入数据
    return data
}

function dealFile (data) {   // 处理导入的数据
    console.log(data)
    this.imFile.value = ''
    this.fullscreenLoading = false
    if (data.length <= 0) {
      this.errorDialog = true
      this.errorMsg = '请导入正确信息'
    } else {
      this.excelData = data
    }
}