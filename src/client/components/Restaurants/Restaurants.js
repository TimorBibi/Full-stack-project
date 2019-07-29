import React from 'react';
import './Restaurants.scss';
import {connect} from 'react-redux';
import RestaurantsActions from '../Restaurants/actions';
import {Button, Form, Input} from 'semantic-ui-react'
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import {List, Map} from 'immutable'
import AddReview from "../AddReview/AddReview";
import {Rating} from 'primereact/rating'
import {InputTextarea} from 'primereact/inputtextarea';
import {InputText} from "primereact/components/inputtext/InputText";
import {Slider} from "primereact/components/slider/Slider";
import {Dropdown} from "primereact/dropdown";
import UsersActions from "../Users/actions";


class Restaurants extends React.Component {

    constructor(){
        super();
        this.itemTemplate = this.itemTemplate.bind(this);
        this.viewRestaurantItem = this.viewRestaurantItem.bind(this);
        this.viewReviewItem = this.viewReviewItem.bind(this);
        this.editReviewItem = this.editReviewItem.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.searchBy = this.searchBy.bind(this);
        this.resetSearchField = this.resetSearchField.bind(this);
        this.resetSearchReviewField = this.resetSearchReviewField.bind(this);
        this.sortReviewBy = this.sortReviewBy.bind(this);
        this.criteriaField = this.criteriaField.bind(this);
        // <ViewProfilePage userID={user.username}/>
    }


        downloadFile(e) {
        const file = e.target.files[0];
        let fs = new FileReader();
        fs.onloadend = () => {
            let pictureData = fs.result;
            let value = {
                pictureType: file.type,
                pictureData: pictureData,
            };
            this.props.updateStateFieldEventHandler(e, {id:'picture' ,value: value});
        };
        fs.readAsDataURL(file);
    }

    viewRestaurantItem(restaurant, showReviews, header)
    {
        const hasReviews = (!restaurant.avgRate && !restaurant.reviews.length)?
            (<label htmlFor="avgRate">no reviews</label>):
            (<div>
                <label htmlFor="avgRate">Rate: </label>
                <p id="avgRate">{Math.round(restaurant.avgRate * 100) / 100}</p>

                <Button id={restaurant.name+"_"+restaurant.location.city}
                        onClick={(e, data) =>
                            this.props.showReviewsEventHandler(data, this.props.showReviews, restaurant.reviews)}
                >View {restaurant.name} Reviews</Button>
            </div>);
        return(
            <div className="p-grid">
                <h2 id="name">{restaurant.name}</h2>
                <label htmlFor="location">Location: </label>
                <p id="location">{restaurant.location.city}</p>
                {hasReviews}
                <hr/>
                {header}
                {showReviews}
            </div>
        );
    }


    viewReviewItem(review, editable)
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
                    <label htmlFor="writer">Writer: </label>
                    <p id="writer">{review.username}</p>
                </Form.Field>
                <Form.Field width='9'>
                    {reviewImg}
                </Form.Field>

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
                <br/>
                {editable}
                <hr/>
            </Form>)
    }

    editReviewItem(review)
    {
        const reviewImg = review.picture.contentType !== "" && review.picture.contentType!==null?
            (<div className="imgPreview">
                <img src={review.picture.data} width="200" height="100"/>
            </div>):
            null;
        console.log("???",this.props.bathroomRate);
        return (
            <Form className="register-form" key={review.username+"_"+review.timeStamp}
                  onSubmit={(e) => {
                      this.props.submitEditEventHandler(
                          review.username,
                          review.name,
                          review.location,
                          review.timeStamp,
                          this.props.bathroomRate,
                          this.props.staffRate,
                          this.props.cleanRate,
                          this.props.foodRate,
                          this.props.driveInRate,
                          this.props.deliveryRate,
                          this.props.picture,
                          this.props.freeText
                      );
                      this.props.makeEditableEventHandler(e, this.props.editReview, review);
                      this.resetSearchField();
                  }}>
            <Form.Field width='9'>
                <label htmlFor="writer">Writer: </label>
                <p id="writer">{review.username}</p>
            </Form.Field>
            <Form.Field width='9'>
                <Input type="file" id="picture"  accept="image/*" onChange={this.downloadFile}/>
                {reviewImg}
            </Form.Field>

            <Form.Field width='9'>
                <label htmlFor="bathroomRate" className="form-text">Bathroom Quality:</label>
                <Rating id='bathroomRate' value={this.props.bathroomRate} cancel={false}
                        onChange={this.props.updateStateFieldEventHandler}/>
            </Form.Field>
            <Form.Field width='9'>
                <label htmlFor="staffRate">Staff Kindness:</label>
                <Rating id='staffRate' value={this.props.staffRate}  stars={5} cancel={false}
                        onChange={this.props.updateStateFieldEventHandler}/>
            </Form.Field>
            <Form.Field width='9'>
                <label htmlFor="cleanRate">Cleanliness:</label>
                <Rating id='cleanRate' value={this.props.cleanRate}  stars={5} cancel={false}
                        onChange={this.props.updateStateFieldEventHandler}/>
            </Form.Field>
            <Form.Field width='9'>
                <label htmlFor="foodRate">Food Quality:</label>
                <Rating id='foodRate' value={this.props.foodRate} stars={5} cancel={false}
                        onChange={this.props.updateStateFieldEventHandler}/>
            </Form.Field>
            <Form.Field width='9'>
                <label htmlFor="driveInRate">Drive-thru Quality:</label>
                <Rating id='driveInRate' value={this.props.driveInRate}  stars={5}
                        onChange={this.props.updateStateFieldEventHandler}/>
            </Form.Field>
            <Form.Field width='9'>
                <label htmlFor="deliveryRate">Delivery Speed:</label>
                <Rating id='deliveryRate' value={this.props.deliveryRate} stars={5}
                        onChange={this.props.updateStateFieldEventHandler}/>
            </Form.Field>
            <Form.Field width='9'>
                <label htmlFor="freeText">Description: </label>
                <InputTextarea id="freeText" value={this.props.freeText}
                               onChange={this.props.updateStateFieldEventHandler}/>
            </Form.Field>
                <br/>
                {/*{editable}*/}
                <Form.Button id={"edit_" + review.username+"_"+review.timeStamp} content='Submit Review' type="submit"/>
                {/*<Form.Button id={"edit_" + review.username+"_"+review.timeStamp} className="ui button"*/}
                {/*        onClick=  {(e) => submitEditEventHandler(e, review)}>Edit</Form.Button>*/}
                <Form.Button id={"cancel_" + review.username+"_"+review.timeStamp} className="ui button"
                        onClick={(e) => this.props.makeEditableEventHandler(e, this.props.editReview, review)} >Cancel</Form.Button>
                <hr/>
            </Form>
        );
    }

    criteriaField(review, criteria)
    {
        switch (criteria) {
            case 'bathroom':
                return review.bathroom;
            case 'staff':
                return review.staff;
            case 'clean':
                return review.clean;
            case 'driveIn':
                return review.driveIn;
            case 'delivery':
                return review.delivery;
            case 'food':
                return review.food;
            default:
                return 5;
        }
    }

    sortReviewBy(reviews)
    {
        let currtime = new Date().toJSON();
        const show = this.props.showOnlyReviewValue;
        const criteria = this.props.criteriaReviewValue.substring(this.props.criteriaReviewValue.indexOf(':')+1);
        const sort = this.props.sortReviewValue;
        const minRate = this.props.ratingRangeReviewValues[0];
        const maxRate = this.props.ratingRangeReviewValues[1];
        let timeParseValue;
        switch (show) {
        case 'showOnlyReviewValue:week':
            timeParseValue = 10;
            break;
        case 'showOnlyReviewValue:month':
            timeParseValue = 7;
            break;
        case 'showOnlyReviewValue:year':
            timeParseValue = 4;
            break;
        default ://all
            timeParseValue = 0;
        }


        let output = reviews.filter((review)=> (timeParseValue === 0? (this.criteriaField(review, criteria) >= minRate
            && this.criteriaField(review, criteria) <= maxRate):
            (((timeParseValue !== 10) &&
            (currtime.substring(0,timeParseValue) === review.timeStamp.substring(0,timeParseValue)))
            || ((timeParseValue === 10) &&
            (Math.abs(Number(currtime.substring(8,10)) - Number(review.timeStamp.substring(8,10)))<= 7))))
            && (this.criteriaField(review, criteria) >= minRate && this.criteriaField(review, criteria) <= maxRate));

        if(sort === 'sortReviewValue:newFirst')
            return (List)(output).sortBy((review) => review.timeStamp).reverse();
        return (List)(output).sortBy((review) => review.timeStamp);
    }

    resetSearchReviewField(restaurant)
    {
       this.props.updateReviewSearchValueEventHandler();
       this.props.updateShowReviewsEventHandler(restaurant.reviews);
    }

    reviewHeader(restaurant) {

        const sortOptions = [
            {label: 'Newest First', value: 'sortReviewValue:newFirst'},
            {label: 'Oldest First', value: 'sortReviewValue:oldFirst'},
        ];

        const showOnlyOptions = [
            {label: 'Last Week', value: 'showOnlyReviewValue:week'},
            {label: 'Last Month', value: 'showOnlyReviewValue:month'},
            {label: 'Last Year', value: 'showOnlyReviewValue:year'},
            {label: 'All Times', value: 'showOnlyReviewValue:all'},
        ];

        const criteriaOptions = [
            {label: 'Bathroom Quality', value: 'criteriaReviewValue:bathroom'},
            {label: 'Staff Kindness', value: 'criteriaReviewValue:staff'},
            {label: 'Cleanliness', value: 'criteriaReviewValue:clean'},
            {label: 'Drive-thru quality', value: 'criteriaReviewValue:driveIn'},
            {label: 'Delivery Speed', value: 'criteriaReviewValue:delivery'},
            {label: 'Food Quality', value: 'criteriaReviewValue:food'},
        ];

        const criteriaSlider = this.props.criteriaReviewValue ==='criteriaReviewValue:'? null:
            <div>
            <h4>Rating Range: {this.props.ratingRangeReviewValues[0]},{this.props.ratingRangeReviewValues[1]}</h4>
            <Slider id="ratingRangeReviewValues" value={this.props.ratingRangeReviewValues} min={1} max={5} animate={true}
                        onChange={this.props.updateReviewSliderFieldEventHandler} range={true} style={{width: '14em'}} />
             </div>;
        return (
            <div className="p-grid">
                <div className="p-col-6" style={{textAlign: 'left'}}>
                    <label htmlFor="sortReview">Sort Reviews By </label>
                    <div className="p-col-6" style={{textAlign: 'left'}}>
                        <Dropdown key = "sortReviewValue" options={sortOptions} value={this.props.sortReviewValue} placeholder="Newest First"
                                  onChange={(e) => (this.props.updateSearchReviewEventHandler(e.value))} />
                    </div>

                    <label htmlFor="showOnlyReview">Show reviews since: </label>
                    <div className="p-col-6" >
                        <Dropdown  key = "showOnlyReviewValue" options={showOnlyOptions} value={this.props.showOnlyReviewValue} placeholder="All Times"
                                  onChange={(e) => (this.props.updateSearchReviewEventHandler(e.value))} />
                    </div>

                    <label htmlFor="criteriaReview">Criteria: </label>
                    <div className="p-col-6" >
                        <Dropdown  key = "criteriaReviewValue" options={criteriaOptions} value={this.props.criteriaReviewValue} placeholder=""
                                  onChange={(e) => (this.props.updateSearchReviewEventHandler(e.value))} />
                    </div>


                    {criteriaSlider}

                    <Button id="searchReviewButton"  className="ui button"
                            onClick={() => (this.props.updateShowReviewsEventHandler(this.sortReviewBy(restaurant.reviews)))}
                    >Search</Button>

                    <Button id="showAllReviewsButton"  className="ui button"
                            onClick={() => (this.resetSearchReviewField(restaurant))}
                    >Show All Reviews</Button>
                </div>
                <div className="p-col-6" style={{textAlign: 'right'}}>
                </div>
            </div>
        );
    }

    itemTemplate(restaurant, layout) {
        if (layout === 'list') {
            // this.props.updateShowReviewsEventHandler(restaurant.reviews);
            const reviewsCond = ((this.props.showReviews.get('selectedRest') === restaurant.name+"_"+restaurant.location.city)
                && this.props.showReviews.get('visible'));

            const header = reviewsCond? this.reviewHeader(restaurant): null;
            const showReviews = reviewsCond?
                // restaurant.reviews.map((review) => {
                this.props.reviewsToShow.map((review) => {
                    const editable = review.username !== this.props.username ? null:
                        (<div>
                            <Button id={review.username+"_"+review.timeStamp}  className="ui button"
                                    onClick={(e) => this.props.makeEditableEventHandler(e, this.props.editReview, review)}>Edit</Button>
                            <Button id={"delete_"+review.username+"_"+review.timeStamp}  className="ui button"
                                    onClick={() => this.props.deleteReviewEventHandler(review)}>Delete</Button>
                        </div>);
                    return ((this.props.editReview.get('selectedReview') === review.username+"_"+review.timeStamp)
                                        && this.props.editReview.get('edit')) ?
                        this.editReviewItem(review): this.viewReviewItem(review, editable);
                })
                : null;
            return (this.viewRestaurantItem(restaurant, showReviews, header));
        }
    }

    resetSearchField()
    {
        this.props.updateSearchValueEventHandler();
        this.props.updateShowRestaurantsEventHandler(this.props.restaurants);
    }

    searchBy()
    {
        const name = this.props.searchNameValue;
        const location = this.props.searchLocationValue;
        const lvalue = this.props.ratingRangeValues[0];
        const rvalue = this.props.ratingRangeValues[1];
        const restaurants = this.props.restaurants;

        return restaurants.filter((rest)=> name === ''? true: rest.name === name)
            .filter((rest)=> location === ''? true: rest.location.city === location)
            .filter((rest)=> rest.avgRate >= lvalue && rest.avgRate <= rvalue);
    }

    restaurantHeader() {
        return (
            <div className="p-grid">
                <div className="p-col-6" style={{textAlign: 'left'}}>
                    <label htmlFor="search">Search Restaurant By </label>
                    <label htmlFor="searchName">Name: </label>
                    <InputText id="searchNameValue" value={this.props.searchNameValue} onChange={this.props.updateStateFieldEventHandler}/>
                    <label htmlFor="searchLocation">Location: </label>
                    <InputText id="searchLocationValue" value={this.props.searchLocationValue} onChange={this.props.updateStateFieldEventHandler}/>
                    <h4>Rating Range: {this.props.ratingRangeValues[0]},{this.props.ratingRangeValues[1]}</h4>
                    <Slider id="ratingRangeValues" value={this.props.ratingRangeValues} min={1} max={5} animate={true}
                            onChange={this.props.updateSliderFieldEventHandler} range={true} style={{width: '14em'}} />

                    <Button id="searchButton"  className="ui button"
                            onClick={() => (this.props.updateShowRestaurantsEventHandler(this.searchBy()))}
                    >Search</Button>

                    <Button id="showAllButton"  className="ui button"
                            onClick={() => (this.resetSearchField())}
                    >Show All Restaurants</Button>
                </div>
                <div className="p-col-6" style={{textAlign: 'right'}}>
                </div>
            </div>
        );
    }

    //TODO: validate filled props
    render() {
        const header = this.restaurantHeader();
        const allowAddReview = !this.props.isConnected ? null :
            <Button label="Add Review" icon="plus" onClick={() => this.props.toggleRestaurantFormEventHandler(this.props.showRestForm)}/>;

        const addReview = this.props.showRestForm? <AddReview/>: null;
        return (
            <div className='restaurants'>
                {header}
                {allowAddReview}
                {addReview}
                <DataView value={this.props.restaurantsToShow} layout="list"
                          itemTemplate={this.itemTemplate}
                          rows={this.props.restaurantsToShow.length}/>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        showRestForm: state['restaurants'].get('showRestaurantForm'),
        isConnected: state['app'].get('isConnected'),
        restaurants: (List) (state['app'].get('restaurants')).toArray(),
        restaurantsToShow: (List) (state['restaurants'].get('restaurantsToShow')).toArray(),
        showReviews: state['restaurants'].get('showReviews'),
        editReview: state['restaurants'].get('editReview'),
        showOnlyReviewValue:state['restaurants'].get('showOnlyReviewValue'),
        criteriaReviewValue:state['restaurants'].get('criteriaReviewValue'),
        sortReviewValue:state['restaurants'].get('sortReviewValue'),
        ratingRangeReviewValues:state['restaurants'].get('ratingRangeReviewValues'),
        reviewsToShow:(List) (state['restaurants'].get('reviewsToShow')).toArray(),
        username: state['app'].get('username'),
        searchNameValue:state['restaurants'].get('searchNameValue'),
        searchLocationValue:state['restaurants'].get('searchLocationValue'),
        ratingRangeValues:state['restaurants'].get('ratingRangeValues'),
        // restaurantName: state['restaurants'].get('restaurantName'),
        // restaurantLocation: state['restaurants'].get('restaurantLocation'),
        bathroomRate: state['restaurants'].get('bathroomRate'),
        staffRate: state['restaurants'].get('staffRate'),
        cleanRate: state['restaurants'].get('cleanRate'),
        foodRate: state['restaurants'].get('foodRate'),
        driveInRate: state['restaurants'].get('driveInRate'),
        deliveryRate: state['restaurants'].get('deliveryRate'),
        avgRate: state['restaurants'].get('avgRate'),
        freeText: state['restaurants'].get('freeText'),
        picture: state['restaurants'].get('picture'),
        submitMessage: state['restaurants'].get('submitMessage'),
    }

};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleRestaurantFormEventHandler: (currVal) => {
             dispatch(RestaurantsActions.toggleRestaurantForm(currVal));
         },
        updateStateFieldEventHandler: (e, data) => {
            if (data) {
                dispatch(RestaurantsActions.updateStateFieldAction(data.id, data.value));
            }
            else
                dispatch(RestaurantsActions.updateStateFieldAction(e.target.id, e.target.value));
        },
        updateSliderFieldEventHandler: (e) => {
            dispatch(RestaurantsActions.updateSliderFieldAction(e.value));
        },
        showReviewsEventHandler: (data, prevReviewValue, reviews) => {
            dispatch(RestaurantsActions.showReviewsAction(prevReviewValue, data.id, reviews));
        },
        makeEditableEventHandler: (e, prevEditReview, reviewContent) => {
            dispatch(RestaurantsActions.enableEditReviewAction(prevEditReview, e.target.id, reviewContent))
        },
        deleteReviewEventHandler: (reviewContent) => {
            dispatch(RestaurantsActions.deleteReviewAction(reviewContent));
        },
        submitEditEventHandler: (username, name, location, timeStamp, bathroom, staff, clean, food, driveIn, delivery, picture, freeText) => {
            dispatch(RestaurantsActions.submitEditReviewAction(
                username,
                name,
                location,
                timeStamp,
                bathroom,
                staff,
                clean,
                food,
                driveIn,
                delivery,
                picture,
                freeText));
        },
        updateShowRestaurantsEventHandler: (restaurants) => {
            dispatch(RestaurantsActions.updateShowRestaurantsAction(restaurants));
        },

        updateSearchValueEventHandler: () => {
            dispatch(RestaurantsActions.updateSearchValueAction());
        },

        updateSearchReviewEventHandler: (value) =>{
            dispatch(RestaurantsActions.updateSearchReviewAction(value));
        },

        updateReviewSliderFieldEventHandler: (e) =>{
            dispatch(RestaurantsActions.updateReviewSliderFieldAction(e.value));
        },

        updateShowReviewsEventHandler:(reviews) => {
            dispatch(RestaurantsActions.updateShowReviewsAction(reviews));

        },
        updateReviewSearchValueEventHandler:() =>{
            dispatch(RestaurantsActions.updateReviewSearchValueAction());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Restaurants);
