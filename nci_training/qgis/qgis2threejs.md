# Exploratory data analysis and visualisation using QGIS

## In this exercies
    
- How to use **QGIS** (http://qgis.org) as a tool for interacting with data using web data services and on the VDI filesystem
- Obtaining data from a Web Coverage Service (WCS)
- Obtaining data from a web-based vector data service
- Obtaining data from the NCI file system using the NetCDF Operators (NCO)
- Using QGIS to fuse data and create a shareable, interactive 3D map rendered using webGL in a browser

We are going to make an interactive version of the map below, starting with data from three different sources merged using QGIS. We will also see some key differences between data access methods.

[End result](./qgis.images/0-3d.map.png \"End result of this session\")

#### The following material uses Geoscience Australia's Elevation Data Collection which is available under the Create Commons License 4.0 through NCI's THREDDS Data Server. For more information on the collection and licensing, please [click here](https://geonetwork.nci.org.au/geonetwork/srv/eng/catalog.search#/metadata/f9082_1236_9859_8989). Also used is ANU Water and Landscape Dynamics tree cover product, available under the Create Commons License 4.0 through NCI's THREDDS Data Server. For more information on the collection and licensing, please [click here](http://geonetwork.nci.org.au/geonetwork/srv/eng/catalog.search#/metadata/f1104_2906_7276_3004)


##$ What is QGIS?

QGIS (Quantum GIS) is an application for geospatial data analysis and visualisation, focussed on 2D (raster and vector) datasets, and wrapped in a straightforward graphical user interface. It can also be used as a Python library, but for this session we use the GUI.

### I have [insert many other tools] on the VDI - why use QGIS?

QGIS can be used on the VDI as a rapid-prototyping tool. If you've got all the infrastructure you need available in your project space and don't need it, that's great!
We hope to demonstrate some ways which QGIS can help you quickly develop shareable, multi-source analyses quickly and simply. We also revise some web service principles.

## 1. Define a question and create some spaces

For this session the question we want to address is:

- How are the 'hilliness' of suburban areas and and 'tree cover' in Canberra related?; and 
- do hillier sections have more or less tree cover than flatter sections?

Before we forge ahead, let's make a project space - in the terminal head to your home directory and create something like:

```$ mkdir ./qgis_vis_files```

...to hold some data subsets we will create, and:

```$ mkdir ./qgis_vis_map```

...to hold our finished map. We will use these throughout the session.

## 2. Decide on some useful datasets

To answer our question we need some data on topography, vegetation and where block boundaries are.
From NCI's collections we can use:
- A Shuttle Radar Topography Mission raster DEM at 1 arc-second resolution: /g/data/rr1/
- Some tree cover indices from the ANU Water and Landscape Dynamics collection: /g/data2/ub8/

NCI doesn't hold cadastral data, so we'll get those from the local land administrator:
- ACT cadastral data outlining sections (held outside NCI)

Note - here, sections are collections of 50 or so individual house blocks. Our elevation and tree cover data are too coarse for individual house blocks - and the vector data file for blocks is massive!

### 3. Take a look at the data held at NCI

#### Elevation

We use an SRTM elevation mosaic, held in Geoscience Australia's elevation reference collection:
THREDDS
http://dapds00.nci.org.au/thredds/catalog/rr1/Elevation/NetCDF/catalog.html
Geonetwork
https://geonetwork.nci.org.au/geonetwork/srv/eng/catalog.search#/metadata/f9082_1236_9859_8989
Licensed under Creative Commons (CCBY4): http://dapds00.nci.org.au/thredds/fileServer/licenses/rr1_licence.pdf
The path to the data on your VDI desktop is:
/g/data1/rr1/Elevation/NetCDF/
As a demonstration, we will acquire these data using a Web Coverage Service (WCS).


#### Tree cover
We will extract tree cover data from the filesystem.
These data come from the ANU Water and Landscape Dynamics collection:
THREDDS
http://dapds00.nci.org.au/thredds/catalog/rr1/Elevation/NetCDF/catalog.html
Geonetwork
http://geonetwork.nci.org.au/geonetwork/srv/eng/catalog.search#/metadata/f1104_2906_7276_3004
The path to the data on your VDI desktop is:
/g/data1/ub8/Elevation/NetCDF/

### 4. Start QGIS on the VDI

Like most VDI applications, we use the module load system to acquire QGIS, GDAL and NCO:
```
module purge
module load gdal-python/1.11.1-py2.7 qgis/2.14.8-py2.7
qgis &
```

This will start QGIS - which we'll use shortly. For now, head to Firefox - we are off to discover some data!
Note - we've also loaded NCO, which we will get to soon.

### 5. Get topography data using Web Coverage Services

For topography we need a terrain model in a raster format, e.g. GeoTIFF, which covers Canberra.
Shuttle Radar Topography Mission (SRTM) data are a good source of reasonably detailed elevation data held at NCI as NetCDF tiles.

We can head to the NCI Elevation collection here:
http://dapds00.nci.org.au/thredds/catalog/rr1/Elevation/catalog.html
...and look for SRTM 1 second elevation as NetCDF. Browse to the NetCDF folder, click through to:
http://dapds00.nci.org.au/thredds/catalog/rr1/Elevation/NetCDF/1secSRTM_DEMs_v1.0/DEM/catalog.html

A bunch of 1 degree tiles are shown here - but we will collect a region we want from the national mosaic:
http://dapds00.nci.org.au/thredds/catalog/rr1/Elevation/NetCDF/1secSRTM_DEMs_v1.0/DEM/catalog.html?dataset=rr1/Elevation/NetCDF/1secSRTM_DEMs_v1.0/DEM/Elevation_1secSRTM_DEMs_v1.0_DEM_Mosaic_dem1sv1_0.nc
Click on the 'WCS' link to see the WCS getCapabilities statement - which describes the data you can obtain here. We need to know the name for the coverage we need - look for the 'name' tag. With that,and using our WCS knowledge, we can request just the part of the data we need and acquire a GeoTIFF image. Let's break a WCS request down into parts we need:
the path to the data: http://dapds00.nci.org.au/thredds/wcs/rr1/Elevation/NetCDF/1secSRTM_DEMs_v1.0/DEM/
the dataset: Elevation_1secSRTM_DEMs_v1.0_DEM_Mosaic_dem1sv1_0.nc
the service: service=WCS
the service version: version=1.0.0
the thing we want to do (get a coverage): request=GetCoverage
the coverage (or layer) we want to get: Coverage=elevation
the boundary of the layer we want: bbox=148.7,-35.8,149.5,-35.1
the format we want to get our coverage as: format=GeoTIFF_Float
To build a WCS request we concatenate the data path and dataset name, put a question mark after the dataset name, then add the rest of the labels describing the thing we want afterward, in any order, separated by ampersands:
http://dapds00.nci.org.au/thredds/wcs/rr1/Elevation/NetCDF/1secSRTM_DEMs_v1.0/DEM/Elevation_1secSRTM_DEMs_v1.0_DEM_Mosaic_dem1sv1_0.nc?service=WCS&version=1.0.0&request=GetCoverage&Coverage=elevation&bbox=148.7,-35.8,149.5,-35.1&format=GeoTIFF_Float
Enter this link into a web browser to obtain a GeoTIFF DEM in your default download location (check in 'downloads'). Rename it to something memorable if you wish, in your qgis_vis_files directory.
Note the use of GeoTIFF_Float - using only GeoTIFF is possible, but gives you an image with pixel values scaled to a colour range, not a data range
Now go to QGIS and import the GeoTIFF as a raster layer:
