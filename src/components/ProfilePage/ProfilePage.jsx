import React, {Component} from 'react';
import './profile-page.css';

class ProfilePage extends Component {

  constructor(props) {
      super(props)
      this.state = {
        file: "",
        imagePreviewUrl: "",
        productName: "",
        productDescription: "",
        submitFunction: function(data) {
            fetch('http://localhost:8080/api/imagesub', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
               'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          })
          }
      }
  };


  componentWillMount() {
    let reader = new FileReader();
    if (this.props.imgFile) {
      let file = this.props.imgFile;
      console.log(file.data)
      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        });
      }
      reader.readAsDataURL(file)
    }
  }


  _handleSubmit(e) {
    e.preventDefault();
    this.props.submitImage(this.state.file)
  //  console.log('handle uploading-(props from navbar)', this.state.file);
    // let Base64img = document.getElementById('profileImg').src
    // let upload = Base64img.replace("data:image/jpeg;base64,","")

    const body_data = new FormData({
      type: 'file'
    });
    body_data.append('image', this.state.file);
    fetch(`https://api.imgur.com/3/upload`, {
      method: 'POST',
      headers: {
        'Authorization': 'Client-ID 6338d70e3026ca4'
      },
      body: body_data
    }).then(response => {
      return response.json();
    }).then( json => {
      return json.data.link
    }).then( link => {
      console.log(this.props.token.token)
      let send = {
        'image':link,
        'token':this.props.token.token
      };
      this.state.submitFunction(send);
    })
}


  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file)
  }

  render() {

    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img id='profileImg' src={imagePreviewUrl} alt="upload preview"/>);
    } else {
      $imagePreview = (<div className="previewText">Please select an image for preview</div>);
    }

    return (
      <div className="profile-page-container">
        <div className="current-user-products">
          <div className="profile-buttons">
            <div className="profile-designs-button">
              YOUR DESIGNS
            </div>
            <div className="profile-orders-button">
              YOUR ORDERS
            </div>
          </div>
          <div className="user-products-items">
          </div>
        </div>
        <div className="user-image-container">
          <div className="user-image-text">
            <div className="user-image-header">
              Upload a design to have it voted on by the community. If your submission gets enough votes, it will be featured and sold on the Shirtvivor shop!
            </div>
            <div className="user-image-form-values">
              <label>Design name</label>
              <input/>
              <label>Short description (optional)</label>
              <input/>
            </div>
          </div>
          <div className="user-image-uploader">
            <div className="preview-image-container">
              <div className="imgPreview">
                {$imagePreview}
              </div>
            </div>
            <div className="upload-image-container">
              <form className="upload-image-form" onSubmit={(e)=>this._handleSubmit(e)}>
                <input className="fileInput" type="file" onChange={(e)=>this._handleImageChange(e)} />
                <button className="submitButton" type="submit" onClick={(e)=>this._handleSubmit(e)}>Upload Image</button>
              </form>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
export default ProfilePage
