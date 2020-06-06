const idCreator = () => {
    return Math.floor(Math.random() * 1000);
  }

  const dateCreator = () => {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    return mm + "/" + dd + "/" + yyyy;
}