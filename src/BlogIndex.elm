module BlogIndex exposing (Model, blogList, homeBlogList, toNavKey, view)

import BlogPosts
import Browser.Navigation as Nav
import Date as D
import Html exposing (Html, a, div, h1, li, ol, p, strong, text, time, ul)
import Html.Attributes as A
import Route as R


type alias Model =
    { navKey : Nav.Key
    , tags : Maybe BlogPosts.Tag
    }


toNavKey : Model -> Nav.Key
toNavKey { navKey } =
    navKey


blogList : Bool -> List BlogPosts.BlogIndexItem -> Html msg
blogList showTags blogItems =
    ol [ A.class "blogIndexList" ] <|
        List.map
            (\{ title, permalink, date, tags } ->
                li [ A.class "blogIndex" ] <|
                    [ a [ R.href <| R.BlogPost (R.Slug permalink) ]
                        [ text title
                        ]
                    , Html.br [] []
                    , time [ A.datetime <| D.renderDate date ]
                        [ text <|
                            D.renderDate date
                        ]
                    ]
                        ++ (if showTags then
                                [ tagList tags ]

                            else
                                []
                           )
            )
            blogItems


indexBlogList : List BlogPosts.BlogIndexItem -> Html msg
indexBlogList =
    blogList True


homeBlogList : List BlogPosts.BlogIndexItem -> Html msg
homeBlogList =
    blogList False


tagList : List BlogPosts.Tag -> Html msg
tagList tags =
    ul [ A.class "taglist" ] <|
        List.map (\t -> li [] [ a [ R.href <| R.BlogIndex (Just t) ] [ text t ] ]) tags


view : Model -> ( String, Html msg )
view m =
    let
        filteredBlogPosts =
            case m.tags of
                Just tag ->
                    List.filter (\{ tags } -> List.member tag tags) BlogPosts.blogIndex

                Nothing ->
                    BlogPosts.blogIndex
    in
    ( "John Whiles' blog"
    , div [ A.class "siteBody" ] <|
        [ h1 [] [ text "John's blog" ]
        , a
            [ A.class "bigLink"
            , A.href "https://www.johnwhiles.com/feed"
            , A.target "_blank"
            ]
            [ text "RSS" ]
        ]
            ++ activeTags m.tags
            ++ [ indexBlogList filteredBlogPosts
               , a [ A.class "bigLink", R.href R.Home ] [ text "go home" ]
               ]
    )


activeTags : Maybe BlogPosts.Tag -> List (Html msg)
activeTags mtag =
    case mtag of
        Just t ->
            [ div []
                [ p [] [ text "Showing posts about: ", strong [] [ text t ] ]
                , a [ R.href <| R.BlogIndex Nothing ] [ text "show all posts" ]
                ]
            ]

        Nothing ->
            []
