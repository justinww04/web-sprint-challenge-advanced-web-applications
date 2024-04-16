import React, { useState } from 'react'

import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'

import Articles from './Articles'

import LoginForm from './LoginForm'

import Message from './Message'

import ArticleForm from './ArticleForm'

import Spinner from './Spinner'

import axios from 'axios' 

import { axiosWithAuth } from '../axios'



const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate("/") }
  const redirectToArticles = () => { navigate("/articles") }
  const logout = () => {
   
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin()

    
  }

  const login = (payload) => {
    
    setSpinnerOn(true)
    axios.post('http://localhost:9000/api/login', payload)
      .then(res => {
       
        localStorage.setItem('token', res.data.token);
        setMessage(res.data.message)
        navigate('/articles')
        setSpinnerOn(false)
      })
      .catch(err => console.log(err))
    
  }

  const getArticles = (check) => {
    
    setSpinnerOn(true)
    axiosWithAuth().get('http://localhost:9000/api/articles')
      .then(res => {
      
        setArticles(res.data.articles)
        if (!check) {
          setMessage(res.data.message)
        }
        setSpinnerOn(false)

      })
      .catch(err => {
        if (err.response.status === 401) {
          redirectToLogin()
        }
        setSpinnerOn(false)
        console.log(err.response.status)
      })

   
  }
  

  const postArticle = article => {
   
    setSpinnerOn(true)
    axiosWithAuth().post('http://localhost:9000/api/articles', article)
      .then(res => {
      
        const newArticles = articles
        newArticles.push(res.data.article)
        console.log(articles, 'HI')

        setArticles(newArticles)
        setMessage(res.data.message)
        setSpinnerOn(false)


      })
      .catch(err => console.log(err))
    setSpinnerOn(false)
  
  }

  const updateArticle = ({ article_id, article }) => {
    console.log(article_id, article)
    setSpinnerOn(true)
    axiosWithAuth().put(`http://localhost:9000/api/articles/${article_id}`, article)
      .then(res => {
        console.log('UPDATE SUCCESSFUL', res.data.message)
        getArticles(true)
        setMessage(res.data.message)
        setSpinnerOn(false)
      }).catch(err => console.log(err))
    setSpinnerOn(false)
  }
  console.log('MESSAGE', message)




  const deleteArticle = article_id => {
    setSpinnerOn(true)
    axiosWithAuth().delete(`http://localhost:9000/api/articles/${article_id}`)
      .then(res => {
        getArticles(true)
        setMessage(res.data.message)
        setSpinnerOn(false)
      })
      .catch(err => console.log(err))
    setSpinnerOn(false)
  }
  
  return (
   



    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> 
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} logout={logout} />} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle}
                articles={articles}
                currentArticleId={currentArticleId}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                deleteArticle={deleteArticle}

              />
              <Articles getArticles={getArticles}
                articles={articles}
                redirectToLogin={redirectToLogin}
                setCurrentArticleId={setCurrentArticleId}
                deleteArticle={deleteArticle}
                currentArticleId={currentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}