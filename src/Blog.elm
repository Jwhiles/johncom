module Blog exposing (Model, init, view)

import Html exposing (Html, a, div, text)
import Route as R


type alias Model =
    { blogPost : BlogPost
    }


view : Model -> Html a
view m =
    div []
        [ a [ R.href R.Home ]
            [ text "take me home" ]
        , text "blorg post"
        ]


type alias BlogPost =
    { copy : String
    , title : String
    , date : String -- ??
    }


init : R.Slug -> Model
init slug =
    let
        blogPost =
            case R.slugToString slug of
                "programming" ->
                    { copy = blogPostOne, title = "programming", date = "2019-10-04" }

                _ ->
                    --@todo
                    { copy = "", title = "", date = "" }
    in
    { blogPost = blogPost }


blogPostOne : String
blogPostOne =
    """
# A history of programming

I learnt to program in the Summer of 2016 to escape what I foresaw to be a future
of adminstrative drudgery. I learnt by writing on

  """
