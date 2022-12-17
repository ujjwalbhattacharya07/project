import React from 'react';

function Footer() {
  return (
    <section className="text-white py-5 bg-black">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <p>Made With ❤️ By Manidhar kodurupaka</p>
          </div>
          <div className="col-md-6 text-end">
           <span style={{ fontSize: 30 }}><i className="fa fa-facebook"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           <span style={{ fontSize: 30 }}><i className="fa fa-twitter"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           <span style={{ fontSize: 30 }}><i className="fa fa-instagram"></i></span>
          </div>
        </div><hr />
      </div>
    </section>
  );
}

export default Footer;
