import { inject, Injectable } from '@angular/core';

import { isNilOrEmpty } from '../functions/common.functions';

import { JsonService } from './json.service';

@Injectable({ providedIn: 'root' })
export class FileService {
  private readonly jsonService: JsonService = inject(JsonService);

  downloadJSONObject(
    data: unknown,
    fileName: string,
    extension: string = 'json'
  ): void {
    const jsonString: string | null | undefined =
      this.jsonService.stringifySafe(data);

    this.downloadJSONString(jsonString, fileName, extension);
  }

  downloadJSONString(
    jsonString: string,
    fileName: string,
    extension: string
  ): void {
    if (isNilOrEmpty(jsonString)) {
      throw new Error('Cannot download file with empty or invalid data');
    }

    this.downloadBlob(jsonString, fileName, extension);
  }

  downloadBlob(jsonString: string, fileName: string, extension: string): void {
    const blob: Blob = new Blob([jsonString], { type: 'application/json' });

    this.downloadUrl(blob, fileName, extension);
  }

  downloadUrl(blob: Blob, fileName: string, extension: string): void {
    const url: string = URL.createObjectURL(blob);

    const tempDownloadLink: HTMLAnchorElement = document.createElement('a');

    tempDownloadLink.href = url;

    tempDownloadLink.download = `${fileName}.${extension}`;

    document.body.appendChild(tempDownloadLink);

    tempDownloadLink.click();

    document.body.removeChild(tempDownloadLink);

    URL.revokeObjectURL(url);
  }
}
