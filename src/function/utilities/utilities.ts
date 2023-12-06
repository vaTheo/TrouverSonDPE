import { writeFile } from 'fs';

export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to save data to a file
export const saveDataToFile = (data: any, filename: string): void => {
    // Convert the data to a JSON string
    const dataString: string = JSON.stringify(data, null, 2);
  
    // Write the string to a file
    writeFile(filename, dataString, 'utf8', (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error('An error occurred while writing JSON to file:', err);
      } else {
        console.log(`Data successfully saved to ${filename}`);
      }
    });
  };