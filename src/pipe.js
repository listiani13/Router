// @flow
// export default function pipe(readStream, writeSteam) {
//   let chunkCount = 0;
//
//   readStream.on('data', (data) => {
//     if (chunkCount === 0) {
//       writeSteam.statusCode = 200;
//       writeSteam.setHeader('Content-Type', 'video/mp4');
//     }
//     console.log('chunkCount', chunkCount);
//
//     chunkCount += 1;
//
//     console.log(`Sending chunk ${chunkCount} @ ${data.length} bytes`);
//     let shouldContinue = writeSteam.write(data);
//     if (shouldContinue === false) {
//       console.log('pausing...');
//       readStream.pause();
//       writeSteam.once('drain', () => {
//         console.log('Drained..');
//         readStream.resume();
//       });
//     }
//   });
// }

export default function pipe(readStream: *, writeStream: *) {
  // let chunkCount = 0;
  readStream.on('data', (data) => {
    // if (chunkCount === 0) {
    //   writeStream.statusCode = 200;
    //   // writeStream.setHeader('Content-Type', 'text/html');
    // }
    // chunkCount += 1;
    let shouldContinue = writeStream.write(data);
    // False artinya dia udah kepenuhan
    if (shouldContinue === false) {
      console.log('Pausing');
      readStream.pause();
      writeStream.once('drain', () => {
        console.log('Drained.');
        readStream.resume();
      });
    }
  });
  readStream.on('end', () => {
    // console.log('done!');
    writeStream.end();
  });
}
