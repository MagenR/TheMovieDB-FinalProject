﻿using System.Web;
using System.Web.Mvc;

namespace TheMovieDB_FinalProject
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
