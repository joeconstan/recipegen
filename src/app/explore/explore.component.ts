import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { CommonService } from '../common.service'

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  lists: any
  // lists = [
  //   {
  //     'id':1,
  //     'title':'Easy Vegan Recipes',
  //     'description': 'just easy recipes dude',
  //     'recipes': [1,2,3,5],
  //     'coverImgFileName':'testimg.jpeg'
  //   },
  //   {
  //     'id':2,
  //     'title':'Joe\'s Favorites',
  //     'description': 'joe\'s favorites!!',
  //     'recipes': [1,2,3,5]
  //   },
  //   {
  //     'id':3,
  //     'title':'10 Minute Recipes',
  //     'description': 'just quick recipes dude',
  //     'recipes': [1,2,3,5]
  //   },
  // ]

  constructor(
    private router: Router,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    // get lists from db
    this.commonService.getLists().subscribe(data => {
        this.lists = data;
        console.log(data)
        // console.log(this.recipe_full)
    },
        error => console.error(error)
    )

  }


  getImgDataS3(list){
     return 'https://recipeimagesbucket.s3.us-west-2.amazonaws.com/' + list.coverimgfilename
  }

  viewListPage(list){
    var uri_param = encodeURIComponent(list.id)
    // let list_url = `/#/list/${uri_param}`
    let list_url = '/list/'+list.id
    this.router.navigate([list_url])

    // redirect to list's full page. so maybe a href instead of a click

  }

}
