library(rjson)
library(flowCore)

##text file rules:
#fields are sepearted by \t
#each line contains the same number records
#one row for the columns names, the colum names has less than 20 characters
#the rest of them are real numbers, at least two rows for the data
args<-commandArgs(TRUE)
input<-fromJSON(args[1])
processinput<-function(input)
{
    input<-input$input
    output<-list()
    output$input<-input
    output$status<-"failure"
    output$fileformat<-"non-fcsfile"
    emptyheader<-FALSE

    idir<-input$data$filedir
    if(!file.exists(idir)){
        output$message<-"the input dir does not exist"
        return(output)
    }
    ifile<-file.path(idir,input$data$filename)
    if(!file.exists(ifile)){
        output$message<-"The input file does not exist"
        return(output)
    }
    
    odir<-input$output$dir
    if(!file.exists(odir)){
        output$message<-"the output dir does not exist"
        return(output)
    }
    
    if(isFCSfile(ifile)){
        output$fileformat<-"fcsfile"
        x<-read.FCS(ifile,which.lines=c(1,2))
        output$colnames<-as.character(colnames(x@exprs))
    }else{
        ##process supposed text file
        header<-scan(ifile,"",sep="\t",nlines=1,
                     strip.white=TRUE,quiet=TRUE,na.strings="")
        if(sum(nchar(header)>20)>0){
            output$message<-"Some column names have more than 20 characters\n"
            return(output)
        }else if(sum(nchar(header)==0)>0){
            output$message<-"Some column names have zero characters\n"
            return(output)
        }else if(length(unique(header))!=length(header)){
            output$message<-"Some column names are not unique\n"
        }else if ( sum(!is.na(suppressWarnings(as.numeric(header))))==length(header) ){
            ##warning, missing header
            header<-paste("column",1:length(header))
            emptyheader<-TRUE
        }
                 
        line1<-scan(ifile,"",sep="\t",nlines=1,skip=1-emptyheader,quiet=TRUE)
        line2<-scan(ifile,"",,sep="\t",nlines=1,skip=2-emptyheader,quiet=TRUE)
        if((length(header)!=length(line1))||
           (length(line2)!=length(line1))){
            output$message<-"the file has an unequal number of fields for the first three lines\n"
            return(output)
        }else{
            number1<-as.numeric(line1)
            number2<-as.numeric(line2)
            if(sum(is.na(number1)>0)|| sum(is.na(number2)>0)){
                output$message<-"The second and third lines of the file contain no-numerical entries\n"
                return(output)    
            }
        }
        output$colnames<-header
    }
    
    if(input$mode=="colnames"){
        output$status<-"success"
        return(output)
    }

    ofile<-file.path(odir,"data.txt")
    if(output$fileformat=="fcsfile"){
        x<-read.FCS(ifile)
        if(input$mode=="checkall"){
            output$numberofevents<-nrow(x@exprs)
            output$status<-"success"
            return(output)
        }else{
            write.table(x@exprs,ofile,row.names=FALSE,col.names=TRUE,
                        sep="\t",quote=FALSE)
            output$info<-list(filedir=odir,txtfile="data.txt")
            output$status<-"success"
            return(output)
        }
    }else{
        x<-read.delim(ifile,sep="\t",colClass="numeric",skip=1-emptyheader,header=FALSE)
        colnames(x)<-output$colnames
        ##first check
        if(sum(is.na(x))>0){
            output$message<-"There are entries in your that can not be converted to numbers\n"
            return(output)
        }
        if(input$mode=="checkall"){
            output$numberofevents<-nrow(x)
            output$status<-"success"
            return(output)
        }else{
            write.table(x,ofile,row.names=FALSE,col.names=TRUE,
                        sep="\t",quote=FALSE)
            output$info<-list(filedir=odir,txtfile="data.txt")
            output$status<-"success"
            return(output)
        }
    }
    output
}

cat("arrives just right before try\n",file=stderr()) 
output<-try(processinput(input))
if(class(output)=="try-error"){
    cat("error in try goes to this\n",file=stderr()) 
    output<-list()
    output$input<-input
    output$status<-"failure"
    output$message<-geterrmessage()
}

output<-list(output=output)
outputstr<-toJSON(output)
write(outputstr,"")


