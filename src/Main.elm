module Main exposing (main)

import Blog
import Browser
import Browser.Navigation as Nav
import Debug
import Html exposing (Html, a, div, h1, text)
import Http
import Platform.Sub as Sub
import Request exposing (getBlogPost)
import Route as R exposing (Route(..))
import Url exposing (Url)


main =
    Browser.application
        { init = init
        , onUrlChange = ChangedUrl
        , onUrlRequest = ClickedLink
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { navKey : Nav.Key
    , rest : SubModel
    }


type SubModel
    = Home
    | BlogModel Blog.Blog
    | BlogIndex


type Msg
    = ClickedLink Browser.UrlRequest
    | ChangedUrl Url
    | GotPost (Result Http.Error String)



-- @todo  decode the initial route here?


init : () -> Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url navKey =
    changeRouteTo (R.fromUrl url) (Model navKey Home)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.rest ) of
        --@todo   parse the new url from the link click
        ( ClickedLink urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    ( model
                    , Nav.pushUrl model.navKey (Url.toString url)
                    )

                Browser.External href ->
                    ( model
                    , Nav.load href
                    )

        ( ChangedUrl url, _ ) ->
            changeRouteTo (R.fromUrl url) model

        ( GotPost response, BlogModel _ ) ->
            case response of
                Ok x ->
                    ( { model | rest = BlogModel <| Blog.build x "hey" }, Cmd.none )

                Err e ->
                    ( { model | rest = BlogModel Blog.NotFound }, Cmd.none )

        ( _, _ ) ->
            ( model, Cmd.none )


changeRouteTo : Maybe Route -> Model -> ( Model, Cmd Msg )
changeRouteTo maybeRoute model =
    case maybeRoute of
        Nothing ->
            ( model, Cmd.none )

        Just R.Home ->
            ( { model | rest = Home }
            , Cmd.none
            )

        Just (R.BlogPost slug) ->
            ( { model | rest = BlogModel <| Blog.init slug }
            , getBlogPost slug GotPost
            )

        Just R.BlogIndex ->
            ( { model | rest = BlogIndex }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Browser.Document Msg
view model =
    Browser.Document "Title" <| [ body model ]


body : Model -> Html Msg
body model =
    case model.rest of
        Home ->
            div []
                [ h1 [] [ text "testing" ]
                , a [ R.href <| R.BlogIndex ] [ text "Blog" ]
                , a [ R.href <| R.BlogPost (R.Slug "programming") ] [ text "BlogPost" ]
                ]

        BlogModel blogModel ->
            Blog.view blogModel

        BlogIndex ->
            div [] <|
                [ text "todo"
                , a [ R.href <| R.Home ] [ text "go home" ]
                ]
                    ++ List.map (\bp -> a [ R.href <| R.BlogPost (R.Slug bp) ] [ text bp ]) Blog.blogIndex
