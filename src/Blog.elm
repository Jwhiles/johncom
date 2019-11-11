module Blog exposing (Blog, blogIndex, init, view)

import Dict exposing (Dict)
import Html exposing (Html, a, div, text)
import Markdown
import Route as R
import Time
import TimeHelpers exposing (getDate)


type Blog
    = Blog BlogPost
    | NotFound



-- internal type


type alias BlogPost =
    { copy : String
    , title : String
    , date : Time.Posix
    }



---


view : Blog -> Html a
view b =
    case b of
        Blog bp ->
            div []
                [ a [ R.href R.Home ]
                    [ text "take meeee home" ]
                , Markdown.toHtml []
                    bp.copy
                ]

        NotFound ->
            div [] []


init : R.Slug -> Blog
init slug =
    let
        thePost =
            R.slugToString slug |> (\x -> Dict.get x blogPosts)
    in
    case thePost of
        Just copy ->
            -- @todo figureout a better way to store these thingums
            Blog { copy = copy, title = R.slugToString slug, date = Time.millisToPosix 1572857902 }

        Nothing ->
            NotFound


type alias MarkDownString =
    String



-- could use the


blogIndex : List String
blogIndex =
    Dict.keys blogPosts


blogPosts : Dict String MarkDownString
blogPosts =
    Dict.fromList
        [ ( "programming", blogPostOne )
        ]


blogPostOne : MarkDownString
blogPostOne =
    """
# A history of programming

I learnt to program in the Summer of 2016 to escape what I foresaw to be a future
of adminstrative drudgery. I learnt by writing on

  """
