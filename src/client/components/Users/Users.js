import React from 'react';
import './Users.scss';
import {connect} from 'react-redux';
import {Button, Form, Label, Input, Segment, Grid, Header, Image} from 'semantic-ui-react'
import {Dropdown} from "primereact/dropdown";
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import {List, Map} from 'immutable';
import {AutoComplete} from 'primereact/autocomplete';
import {Rating} from 'primereact/rating';
import UsersActions from '../Users/actions';
import Review from "../Review/Review";

class Users extends React.Component {

    constructor(){
        super();
        this.itemTemplate = this.itemTemplate.bind(this);
        this.viewUserItem = this.viewUserItem.bind(this);
        this.viewReviewItem = this.viewReviewItem.bind(this);
        this.searchBy = this.searchBy.bind(this);
        this.resetSearchField = this.resetSearchField.bind(this);
    }

        componentDidUpdate() {
        if (this.props.movetoViewProfilePage)
            this.props.history.push('/viewProfile'); //reload the root page
    }

    viewUserItem(user, showReviews)
    {
        const imgsrc = user.picture.data;
        const myProfile = user.username !== this.props.username ? null:
            (<div>
                <Button id={"profile_"+user.username} className='users_show_reviews' basic color='violet'
                    onClick={() => this.props.moveToUserProfileEventHandler()}
                >My Profile</Button>
            </div>);
        const hasReviews = (!user.reviews.length)?
            (<Header className= 'no_reviews' id="no_reviews" as='p' color='grey'>no reviews</Header>):
            (<div>
                <Button id={user.username} className='users_show_reviews' basic color='violet'
                        onClick={(e, data) =>
                            this.props.showUserReviewsEventHandler(data, this.props.showReviews)}
                >Reviews</Button>
            </div>);
        return(
            <div className='user_item'>
                <Segment stacked>
                    <Grid  verticalAlign='middle'>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Grid columns={2}>
                                    <Grid.Column>
                                        <Image src={imgsrc} size='small' spaced='left'/>
                                    </Grid.Column>
                                    <Grid.Column verticalAlign='middle'>
                                    <Header className= 'show_user' id="userName" as='h1' color='grey'>
                                        {user.username}
                                    </Header>
                                    <Header className= 'show_user' id="location" as='h5' color='grey'>
                                        {user.location.city}
                                    </Header>
                                    </Grid.Column>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column>
                                {myProfile}
                                {hasReviews}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                {showReviews}
            </div>

            // <div className="view-user" key={user.username}>
            //     <h2 id="userName">{user.username}</h2>
            //     <label htmlFor="location">Location: </label>
            //     <p id="location">{user.location.city}</p>
            //     <div className="imgPreview">
            //         <img src={imgsrc} width="200" height="100"/>
            //     </div>
            //     {myProfile}
            //     {hasReviews}
            //     <hr/>
            //     {showReviews}
            // </div>
        );
    }


    viewReviewItem(review)
    {
        const hasFreeText = review.freeText?
            (<label htmlFor="freeText">Description: {review.freeText}</label>)
            : null;
        const reviewImg = review.picture.contentType !== "" && review.picture.contentType!==null?
            (<div className="imgPreview">
                <img src={review.picture.data} width="200" height="100"/>
            </div>):
            null;

        return(
            <Form className="register-form" key={review.username+"_"+review.timeStamp}>
                <Form.Field width='9'>
                    {reviewImg}
                </Form.Field>
                <Form.Field width='9'>
                    <p id="restaurant">{review.name}</p>
                </Form.Field>
                <Form.Field width='9'>
                <label htmlFor="location" className="form-text">Location: </label>
                    <p id="location">{review.location.city}</p>
                </Form.Field >
                <Form.Field width='9'>
                    <label htmlFor="bathroomRate" className="form-text">Bathroom Quality:</label>
                    <Rating id='bathroomRate' value={review.bathroom} cancel={false} readonly={true}/>
                </Form.Field>
                <Form.Field width='9'>
                    <label htmlFor="staffRate">Staff Kindness:</label>
                    <Rating id='staffRate' value={review.staff}  stars={5} cancel={false} readonly={true}/>
                </Form.Field>
                <Form.Field width='9'>
                    <label htmlFor="cleanRate">Cleanliness:</label>
                    <Rating id='cleanRate' value={review.clean}  stars={5} cancel={false} readonly={true}/>
                </Form.Field>
                <Form.Field width='9'>
                    <label htmlFor="foodRate">Food Quality:</label>
                    <Rating id='foodRate' value={review.food} stars={5} cancel={false} readonly={true}/>
                </Form.Field>
                <Form.Field width='9'>
                    <label htmlFor="driveInRate">Drive-thru Quality:</label>
                    <Rating id='driveInRate' value={review.driveIn}  stars={5} readonly={true}/>
                </Form.Field>
                <Form.Field width='9'>
                    <label htmlFor="deliveryRate">Delivery Speed:</label>
                    <Rating id='deliveryRate' value={review.delivery} stars={5} readonly={true}/>
                </Form.Field>
                <Form.Field width='9'>
                    {hasFreeText}
                </Form.Field>
                <hr/>
            </Form>)
    }

    itemTemplate(user, layout) {
        if (layout === 'list') {
            const showReviews = ((this.props.showReviews.get('selectedUser') === user.username)
                                && this.props.showReviews.get('visible')
                                 && user.reviews.length > 0) ?
                user.reviews.map((review) =>
                <Review review={review} key={review.username+"_user_"+review.timeStamp} /> )
                : null;
            return (this.viewUserItem(user, showReviews));
        }
    }

    resetSearchField()
    {
        this.props.updateSearchKeyEventHandler('');
        this.props.updateSearchValueEventHandler('');
        this.props.updateShowUsersEventHandler(this.props.users);
    }
    searchBy()
    {
        const key = this.props.searchKey;
        const value = this.props.searchValue;
        const users = this.props.users;

        if (!value || !key)
            return users;

        if(key === 'user')
            return users.filter((user)=> user.username.toLowerCase() === value.toLowerCase());
        if(key === 'location')
            return users.filter((user)=> user.location.city.toLowerCase() === value.toLowerCase());
        if(key === 'restaurant')
            return users.filter((user)=> user.reviews.length > 0?
                user.reviews.filter((review)=> review.name === value).length > 0 : false);
    }

    renderHeader() {
        const searchOptions = [
            {label: 'User Name', value: 'user'},
            {label: 'User Location', value: 'location'},
            {label: 'Restaurant Name', value: 'restaurant'}
        ];

        return (
            <div className="p-grid">
                <div className="p-col-6" style={{textAlign: 'left'}}>
                    <Dropdown options={searchOptions} value={this.props.searchKey} placeholder="Search By"
                              onChange={(e) =>
                    (this.props.updateSearchKeyEventHandler(e.value, this.props.locations,
                        this.props.users, this.props.restaurants))} />

                    <AutoComplete id="searchValue" onChange={this.props.updateStateFieldEventHandler}
                                  suggestions={this.props.suggestions}
                                  value = {this.props.searchValue}
                                  completeMethod={(e) => this.props.suggestionsEventHandler(this.props.selectedSuggestionsOption, e)}/>

                    <Button id="searchButton"  className="ui button"
                            onClick={() => (this.props.updateShowUsersEventHandler(this.searchBy()))}
                    >Search</Button>
                    <Button id="showAllButton"  className="ui button"
                            onClick={() => (this.resetSearchField())}
                    >Show All Users</Button>
                </div>
                <div className="p-col-6" style={{textAlign: 'right'}}>
                </div>
            </div>
        );
    }

    render() {
        const header = this.renderHeader();

        return (
            <div className='users'>
                {header}
                <DataView value={this.props.usersToShow} layout="list"
                          itemTemplate={this.itemTemplate}
                          rows={this.props.users.length}/>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        searchKey: state['users'].get('searchKey'),
        searchValue: state['users'].get('searchValue'),
        showRestForm: state['users'].get('showRestaurantForm'),
        isConnected: state['app'].get('isConnected'),
        users: (List) (state['app'].get('users')).toArray(),
        locations: state['app'].get('locations'),
        restaurants: (List) (state['app'].get('restaurants')).toArray(),
        suggestions: (List) (state['users'].get('suggestions')).toArray(),
        selectedSuggestionsOption: (List) (state['users'].get('selectedSuggestionsOption')).toArray(),
        usersToShow: (List) (state['users'].get('usersToShow')).toArray(),
        showReviews: state['users'].get('showReviews'),
        username: state['app'].get('username'),
        movetoViewProfilePage: state['users'].get('movetoViewProfilePage'),
        didUpdate: state['users'].get('usersDidUpdate'),
    }

};

const mapDispatchToProps = (dispatch) => {
    return {
        updateStateFieldEventHandler: (e) => {
            dispatch(UsersActions.updateStateFieldAction(e.target.id, e.target.value));
        },
        showUserReviewsEventHandler: (data, prevReviewValue) => {
            dispatch(UsersActions.showUserReviewsAction(prevReviewValue, data.id));
        },
        moveToUserProfileEventHandler:() => {
            dispatch(UsersActions.moveToUserProfileAction());
        },
        updateShowUsersEventHandler: (users) => {
            dispatch(UsersActions.updateShowUsersAction(users, false));
        },
        updateSearchKeyEventHandler: (key, locations, users, restaurants) => {
            dispatch(UsersActions.updateSearchKeyAction(key, locations, users, restaurants));
        },
        updateSearchValueEventHandler: (value) => {
            dispatch(UsersActions.updateSearchValueAction(value));
        },
        suggestionsEventHandler: (auto, e) => {
            dispatch(UsersActions.suggestInUsersAction(auto ,e.query));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);