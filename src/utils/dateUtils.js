/**
 * Obtiene el inicio y fin de la semana actual, considerando que las semanas comienzan en domingo.
 * @returns {Object} Un objeto con las propiedades start y end, representando el inicio y fin de la semana actual.
 */
function getCurrentWeek() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 es domingo, 1 es lunes, etc.
    const diff = now.getDate() - currentDay;

    const startDate = new Date(now.setDate(diff));
    startDate.setHours(0, 0, 0, 0); // Establecer a medianoche

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999); // Establecer al final del día

    return {
        start: startDate,
        end: endDate
    };
}
  
/**
 * Obtiene el inicio y fin de la próxima semana, considerando que las semanas comienzan en domingo.
 * @returns {Object} Un objeto con las propiedades start y end, representando el inicio y fin de la próxima semana.
 */
function getNextWeek() {
    const currentWeek = getCurrentWeek();
    const startDate = new Date(currentWeek.end);
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(0, 0, 0, 0); // Establecer a medianoche
  
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999); // Establecer al final del día
  
    return {
      start: startDate,
      end: endDate
    };
}
  
export default {
    getCurrentWeek,
    getNextWeek
};