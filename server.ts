import app from './src/api/app';
import { CommonFunctions } from './src/api/common/commonFunctions';
import { PrintColorType } from './src/api/enums/printColorType.enum';

//const port = 8080;
const port = process.env.PORT || 8080;

let listenServer = app.listen(port, (): void => {
  CommonFunctions.PrintConsoleColor(
    'escudo-antigripal-webapp-server is listening on port ' + port.toString(),
    PrintColorType.info
  );
});

export { listenServer };
