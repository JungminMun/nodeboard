$(() =>{
    get2digits = (num) =>{
        return ('0' + num).slice(-2);
    }
    
    getDate = (dateObj) => {
        if(dateObj instanceof Date) return dateObj.getFullYear() + '-' + get2digits(dateObj.getMonth()+1)+ '-' + get2digits(dateObj.getDate());
    }
  
    getTime = (dateObj) =>{
      if(dateObj instanceof Date) return get2digits(dateObj.getHours()) + ':' + get2digits(dateObj.getMinutes())+ ':' + get2digits(dateObj.getSeconds());
    }
  
    convertDate = () =>{
      $('[data-date]').each((index,element) => {
            var dateString = $(element).data('date');
            if(dateString){
                var date = new Date(dateString);
                $(element).html(getDate(date));
            }
      });
    }
  
    convertDateTime = () => {
        $('[data-date-time]').each((index,element) =>{
            var dateString = $(element).data('date-time');
            if(dateString){
                var date = new Date(dateString);
                $(element).html(getDate(date)+' '+getTime(date));
            }
        });
    }
  
    convertDate();
    convertDateTime();
});
  