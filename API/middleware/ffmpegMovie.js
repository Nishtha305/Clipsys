const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
function convert720(videoFile, folderName) {
    var dir = `./uploads/movies/${folderName}/720`
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    ffmpeg(`./uploads/trash/${videoFile}`)
        .addOption([
            '-codec:v libx264',
            '-crf 18',
            '-preset slow',
            '-start_number 0',
            '-hls_time 10',
            '-hls_list_size 0',
            '-f hls',
            '-vf scale=720x264',
        ])
        .output(`./uploads/movies/${folderName}/720/${folderName}.m3u8`)
        .on('start', function () {
            console.log('Conversion Started...');
        })
        .on('progress', function (progress) {
            console.log('in Progress:', progress);
        })
        .on('end', function () {
            console.log('File Converted...');
        }).on('error', function (err) {
            console.log('Something is Wrong:', err);
        }).run()
}
function convert480(videoFile, folderName) {
    var dir = `./uploads/movies/${folderName}/480`
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    ffmpeg(`./uploads/trash/${videoFile}`)
        .addOption([
            '-codec:v libx264',
            '-crf 18',
            '-preset slow',
            '-start_number 0',
            '-hls_time 10',
            '-hls_list_size 0',
            '-f hls',
            '-vf scale=480x264',
        ])
        .output(`./uploads/movies/${folderName}/480/${folderName}.m3u8`)
        .on('start', function () {
            console.log('Conversion Started...');
        })
        .on('progress', function (progress) {
            console.log('in Progress:', progress);
        })
        .on('end', function () {
            console.log('File Converted...');
        }).on('error', function (err) {
            console.log('Something is Wrong:', err);
        }).run()
}
function convert360(videoFile, folderName) {
    var dir = `./uploads/movies/${folderName}/360`
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    ffmpeg(`./uploads/trash/${videoFile}`)
        .addOption([
            '-codec:v libx264',
            '-crf 18',
            '-preset slow',
            '-start_number 0',
            '-hls_time 10',
            '-hls_list_size 0',
            '-f hls',
            '-vf scale=360x264',
        ])
        .output(`./uploads/movies/${folderName}/360/${folderName}.m3u8`)
        .on('start', function () {
            console.log('Conversion Started...');
        })
        .on('progress', function (progress) {
            console.log('in Progress:', progress);
        })
        .on('end', function () {
            console.log('File Converted...');
        }).on('error', function (err) {
            console.log('Something is Wrong:', err);
        }).run()
}
function convertm3u8(videoFile, folderName) {
    var dir = `./uploads/movies/${folderName}`
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    ffmpeg(`./uploads/trash/${videoFile}`)
        .addOption([
            '-codec:v libx264',
            '-crf 18',
            '-preset slow',
            '-start_number 0',
            '-hls_time 10',
            '-hls_list_size 0',
            '-f hls'
        ])
        .output(`./uploads/movies/${folderName}/${folderName}.m3u8`)
        .on('start', function () {
            console.log('Conversion Started...');
        })
        .on('progress', function (progress) {
            console.log('in Progress:', progress);
        })
        .on('end', function () {
            console.log('File Converted...');
        }).on('error', function (err) {
            console.log('Something is Wrong:', err);
        }).run()
}
function videoThumbnail(videoFile, folderName) {
    var dir = `./uploads/movies/${folderName}`
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    ffmpeg(`./uploads/trash/${videoFile}`).addOption([
        '-ss 00:00:10',
        '-vframes 1'
    ]).output(`./uploads/movies/${folderName}/${folderName}.png`).run()
}
module.exports = {
    convertm3u8,
    convert720,
    convert480,
    convert360,
    videoThumbnail
}
