/**
 * แท็กของ Data Cache — หน้า public อ่านข้อมูลผ่าน fetch ที่ติดแท็กเหล่านี้
 * หน้าแอดมินเขียนเสร็จแล้วเรียก revalidateTag() ด้วยแท็กเดียวกันเพื่อล้างแคช
 *
 * ทำไมไม่พึ่ง revalidatePath อย่างเดียว: revalidatePath ล้างเฉพาะ "หน้า" ที่ระบุ
 * ส่วนผลลัพธ์ของ fetch ที่ถูกแคชไว้ใน Data Cache ยังอยู่ต่อได้จนครบ revalidate
 * หน้าแรกกับหน้าปฏิทินจึงยัง render ข้อมูลชุดเดิมออกมาแม้จะสั่ง revalidatePath แล้ว
 */
export const TAG_PROJECTS = 'projects';
export const TAG_COMPETITIONS = 'competitions';
