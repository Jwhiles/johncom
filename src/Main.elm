module Main exposing (main)

import Blog
import BlogIndex
import Browser
import Browser.Navigation as Nav
import Home
import Html exposing (Html)
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


type Model
    = Home Nav.Key
    | BlogModel Blog.Model
    | BlogIndex BlogIndex.Model


toNavKey : Model -> Nav.Key
toNavKey model =
    case model of
        Home nk ->
            nk

        BlogModel m ->
            Blog.toNavKey m

        BlogIndex m ->
            BlogIndex.toNavKey m


type Msg
    = ClickedLink Browser.UrlRequest
    | ChangedUrl Url
    | GotPost (Result Http.Error String)



-- @todo  decode the initial route here?


init : () -> Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url navKey =
    changeRouteTo (R.fromUrl url) (Home navKey)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        --@todo   parse the new url from the link click
        ( ClickedLink urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    ( model
                    , Nav.pushUrl (toNavKey model) (Url.toString url)
                    )

                Browser.External href ->
                    ( model
                    , Nav.load href
                    )

        ( ChangedUrl url, _ ) ->
            changeRouteTo (R.fromUrl url) model

        ( GotPost response, BlogModel m ) ->
            case response of
                Ok x ->
                    ( BlogModel { m | blogPost = Blog.build x "hey" }, Cmd.none )

                Err e ->
                    ( BlogModel { m | blogPost = Blog.NotFound }, Cmd.none )

        ( _, _ ) ->
            ( model, Cmd.none )


changeRouteTo : Maybe Route -> Model -> ( Model, Cmd Msg )
changeRouteTo maybeRoute model =
    case maybeRoute of
        Nothing ->
            ( model, Cmd.none )

        Just R.Home ->
            ( Home (toNavKey model)
            , Cmd.none
            )

        Just (R.BlogPost slug) ->
            ( BlogModel { navKey = toNavKey model, blogPost = Blog.init }
            , getBlogPost slug GotPost
            )

        Just R.BlogIndex ->
            ( BlogIndex <| BlogIndex.Model <| toNavKey model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Browser.Document Msg
view model =
    Browser.Document "Title" <| [ body model ]


body : Model -> Html Msg
body model =
    case model of
        Home _ ->
            Home.view

        BlogModel blogModel ->
            Blog.view blogModel

        BlogIndex _ ->
            BlogIndex.view
