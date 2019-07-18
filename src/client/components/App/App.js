import React from 'react';
import './App.scss';
import TopBar from '../TopBar';
import { connect } from 'react-redux';
import AppActions from './actions';
import GalleryActions from '../Gallery/actions';
import RegisterPage from "../RegisterPage/RegisterPage";



class App extends React.Component {
    componentDidMount() {
        //TODO load user if isConnected === true
    }

  render() {
        const activePage = () => {
            switch (this.props.activePage) {
                case 'register': return <RegisterPage/>;
                default: return <RegisterPage/>;
            }
        }
        return (
            <div className="app-root">
                <div className="app-header">
                    <TopBar/>
                    <h2>Restaurateur</h2>
                </div>
                <div className="app-body">
                    {activePage()}
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
  return {
      tag: state['app'].get('tag'),
      tags: state['app'].get('tags').toArray(),
      activePage: state['topbar'].get('activeItem'),
      isConnected : state['registerPage'].get('done'),
      user: {
          username: state['registerPage'].get('username'),
          location: {
              city: state['registerPage'].get('location'),
              x: 0,
              y: 0,
          },
          // picture: {
          //     pictureType: state['registerPage'].get('picture').pictureType,
          //     pictureData: state['registerPage'].get('picture').pictureData,
          // }
      },
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTagsEventHandler: () => {
      dispatch(AppActions.loadTagsAction());
    },
    updateTagEventHandler: (e) => {
      dispatch(AppActions.updateTagAction(e.value));
    },
    loadImagesEventHandler: (tag) => {
      dispatch(GalleryActions.loadImagesAction("dog"))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
// import React from 'react';
// import './App.scss';
// import Gallery from '../Gallery';
// import { connect } from 'react-redux';
// import AppActions from './actions';
// import GalleryActions from '../Gallery/actions';
// import { Button } from 'primereact/button';
// import { Dropdown } from 'primereact/dropdown';
//
// class App extends React.Component {
//     componentDidMount() {
//         this.props.loadTagsEventHandler();
//     }
//
//     render() {
//         console.log('tags=', this.props.tags);
//         return (
//             <div className="app-root">
//                 <div className="app-header">
//                     <h2>Flickr Gallery</h2>
//                     <Dropdown
//                         value={this.props.tag}
//                         onChange={this.props.updateTagEventHandler}
//                         options={this.props.tags}
//                         placeholder="insert a tag"
//                         editable={true}
//                     />
//                     <Button
//                         label="Search"
//                         className="p-button-raised p-button-rounded"
//                         onClick={() => this.props.loadImagesEventHandler(this.props.tag)}
//                     />
//                 </div>
//                 <Gallery/>
//             </div>
//         );
//     }
// }
//
//
// const mapStateToProps = (state) => {
//     return {
//         tag: state['app'].get('tag'),
//         tags: state['app'].get('tags').toArray()
//     }
// };
//
// const mapDispatchToProps = (dispatch) => {
//     return {
//         loadTagsEventHandler: () => {
//             dispatch(AppActions.loadTagsAction());
//         },
//         updateTagEventHandler: (e) => {
//             dispatch(AppActions.updateTagAction(e.value));
//         },
//         loadImagesEventHandler: (tag) => {
//             dispatch(GalleryActions.loadImagesAction(tag))
//         }
//     }
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(App);