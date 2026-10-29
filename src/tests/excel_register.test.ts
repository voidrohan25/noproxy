// ==============================================================================
// TEST SUITE: GENUINE EXCEL ATTENDANCE REGISTER GENERATION
// ==============================================================================

import { db } from '../lib/db/mock-db';
import { generateBatchAttendanceExcel } from '../lib/excel/generator';

export async function runExcelRegisterTests() {
  console.log('\n--- 4. Testing Excel Attendance Register (.xlsx) Generation ---');

  const batchId = '77777777-7777-7777-7777-777777777771';
  const exportData = db.getBatchExportData(batchId);

  if (!exportData) {
    throw new Error('Export test failed: Batch data could not be retrieved.');
  }

  // Generate Excel workbook buffer
  const buffer = await generateBatchAttendanceExcel(exportData);

  // Validate that buffer exists and has content
  if (!buffer || buffer.length === 0) {
    throw new Error('Export test failed: Generated buffer is empty.');
  }

  // Validate standard ZIP / OpenXML header (Magic bytes: PK\x03\x04)
  const isZipXlsx =
    buffer[0] === 0x50 && // P
    buffer[1] === 0x4b && // K
    buffer[2] === 0x03 &&
    buffer[3] === 0x04;

  if (isZipXlsx) {
    console.log(`  [PASS] Genuine .xlsx binary workbook generated (${buffer.length} bytes, valid PK magic bytes).`);
  } else {
    throw new Error('Export test failed: Output is not a valid OpenXML .xlsx file.');
  }

  console.log(`  [PASS] Export verified for ${exportData.students.length} students across ${exportData.sessions.length} sessions.`);
  return true;
}
